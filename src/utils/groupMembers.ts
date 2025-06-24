import { supabase } from '../lib/supabase'
import type { GroupMember } from '../types/database'

export const groupMembersUtils = {
  async addMemberToGroup(groupId: string, profileId: string): Promise<GroupMember | null> {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        profile_id: profileId
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding member to group:', error)
      return null
    }
    return data
  },

  async removeMemberFromGroup(groupId: string, profileId: string): Promise<boolean> {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('profile_id', profileId)

    if (error) {
      console.error('Error removing member from group:', error)
      return false
    }
    return true
  },

  async getGroupMembers(groupId: string): Promise<(GroupMember & { profile?: any })[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        profiles (
          id,
          name
        )
      `)
      .eq('group_id', groupId)
      .order('joined_at')

    if (error) {
      console.error('Error fetching group members:', error)
      return []
    }

    return data.map(member => ({
      ...member,
      profile: member.profiles
    }))
  },

  async getUserGroups(profileId?: string): Promise<(GroupMember & { group?: any })[]> {
    const userId = profileId || (await supabase.auth.getUser()).data.user?.id
    if (!userId) return []

    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        groups (
          id,
          name,
          created_at,
          owner_id,
          profiles!groups_owner_id_fkey (
            id,
            name
          )
        )
      `)
      .eq('profile_id', userId)
      .order('joined_at', { ascending: false })

    if (error) {
      console.error('Error fetching user groups:', error)
      return []
    }

    return data.map(member => ({
      ...member,
      group: {
        ...member.groups,
        owner: member.groups.profiles
      }
    }))
  },

  async isUserInGroup(groupId: string, profileId?: string): Promise<boolean> {
    const userId = profileId || (await supabase.auth.getUser()).data.user?.id
    if (!userId) return false

    const { data, error } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('group_id', groupId)
      .eq('profile_id', userId)
      .single()

    return !error && !!data
  },

  async getGroupMemberCount(groupId: string): Promise<number> {
    const { count, error } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)

    if (error) {
      console.error('Error getting group member count:', error)
      return 0
    }
    return count || 0
  },

  async getMemberJoinDate(groupId: string, profileId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('group_members')
      .select('joined_at')
      .eq('group_id', groupId)
      .eq('profile_id', profileId)
      .single()

    if (error) {
      console.error('Error getting member join date:', error)
      return null
    }
    return data.joined_at
  },

  async getGroupsUserCanJoin(searchQuery?: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Get all groups the user is not a member of
    const { data: userGroups } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('profile_id', user.id)

    const userGroupIds = userGroups?.map(g => g.group_id) || []

    let query = supabase
      .from('groups')
      .select(`
        id,
        name,
        created_at,
        owner_id,
        profiles!groups_owner_id_fkey (
          id,
          name
        )
      `)

    if (userGroupIds.length > 0) {
      query = query.not('id', 'in', `(${userGroupIds.join(',')})`)
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    query = query.order('created_at', { ascending: false }).limit(20)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching groups user can join:', error)
      return []
    }

    return data.map(group => ({
      ...group,
      owner: group.profiles
    }))
  },

  async requestToJoinGroup(groupId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // For now, directly add the user (in a real app, this might create a join request)
    return !!(await this.addMemberToGroup(groupId, user.id))
  }
}
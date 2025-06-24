import { supabase } from '../lib/supabase'
import type { Group, GroupWithMembers, CreateGroupData, UpdateGroupData, GroupMember } from '../types/database'

export const groupsUtils = {
  async getUserGroups(): Promise<GroupWithMembers[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        joined_at,
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
      .eq('profile_id', user.id)

    if (error) {
      console.error('Error fetching user groups:', error)
      return []
    }

    return data.map(item => ({
      ...item.groups,
      owner: item.groups.profiles,
      joined_at: item.joined_at
    })) as GroupWithMembers[]
  },

  async getGroup(id: string): Promise<GroupWithMembers | null> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        profiles!groups_owner_id_fkey (
          id,
          name
        ),
        group_members (
          profile_id,
          joined_at,
          profiles (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching group:', error)
      return null
    }

    return {
      ...data,
      owner: data.profiles,
      members: data.group_members.map((member: any) => ({
        ...member,
        profile: member.profiles
      })),
      member_count: data.group_members.length
    }
  },

  async createGroup(groupData: CreateGroupData): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .insert(groupData)
      .select()
      .single()

    if (error) {
      console.error('Error creating group:', error)
      return null
    }

    // Add creator as a member
    await this.addMemberToGroup(data.id, groupData.owner_id)
    
    return data
  },

  async updateGroup(groupData: UpdateGroupData): Promise<Group | null> {
    const { id, ...updates } = groupData
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating group:', error)
      return null
    }
    return data
  },

  async deleteGroup(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting group:', error)
      return false
    }
    return true
  },

  async addMemberToGroup(groupId: string, profileId: string): Promise<boolean> {
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        profile_id: profileId
      })

    if (error) {
      console.error('Error adding member to group:', error)
      return false
    }
    return true
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

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
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

    if (error) {
      console.error('Error fetching group members:', error)
      return []
    }
    return data
  },

  async isUserGroupMember(groupId: string, profileId?: string): Promise<boolean> {
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

  async isUserGroupOwner(groupId: string, profileId?: string): Promise<boolean> {
    const userId = profileId || (await supabase.auth.getUser()).data.user?.id
    if (!userId) return false

    const { data, error } = await supabase
      .from('groups')
      .select('owner_id')
      .eq('id', groupId)
      .eq('owner_id', userId)
      .single()

    return !error && !!data
  },

  async leaveGroup(groupId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    return this.removeMemberFromGroup(groupId, user.id)
  }
}
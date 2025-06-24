import { supabase } from '../lib/supabase'
import type { Profile, CreateProfileData, UpdateProfileData } from '../types/database'

export const profilesUtils = {
  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  },

  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    return this.getProfile(user.id)
  },

  async createProfile(profileData: CreateProfileData): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }
    return data
  },

  async updateProfile(profileData: UpdateProfileData): Promise<Profile | null> {
    const { id, ...updates } = profileData
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }
    return data
  },

  async deleteProfile(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting profile:', error)
      return false
    }
    return true
  },

  async getGroupMemberProfiles(groupId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        profile_id,
        profiles (*)
      `)
      .eq('group_id', groupId)

    if (error) {
      console.error('Error fetching group member profiles:', error)
      return []
    }

    return data.map(member => member.profiles).filter(Boolean) as unknown as Profile[]
  },

  async searchProfiles(query: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(10)

    if (error) {
      console.error('Error searching profiles:', error)
      return []
    }
    return data
  }
}
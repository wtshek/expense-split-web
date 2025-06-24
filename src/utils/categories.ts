import { supabase } from '../lib/supabase'
import type { Category } from '../types/database'

export const categoriesUtils = {
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    return data
  },

  async getCategory(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return null
    }
    return data
  },

  async getCategoriesWithUsage(): Promise<(Category & { usage_count: number })[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        expenses(count)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching categories with usage:', error)
      return []
    }

    return data.map(category => ({
      ...category,
      usage_count: category.expenses?.[0]?.count || 0
    }))
  },

  getPopularCategories(): string[] {
    return ['food', 'grocery', 'transport', 'entertainment', 'shopping']
  },

  getCategoryIcon(categoryId: string): string {
    const iconMap: Record<string, string> = {
      'food': '🍽️',
      'grocery': '🛒',
      'transport': '🚗',
      'home': '🏠',
      'entertainment': '🎬',
      'shopping': '🛍️',
      'health': '🏥',
      'travel': '✈️',
      'education': '📚',
      'other': '📦'
    }
    return iconMap[categoryId] || '📦'
  },

  getCategoryName(categoryId: string): string {
    const nameMap: Record<string, string> = {
      'food': 'Food & Dining',
      'grocery': 'Groceries',
      'transport': 'Transportation',
      'home': 'Home & Utilities',
      'entertainment': 'Entertainment',
      'shopping': 'Shopping',
      'health': 'Health & Fitness',
      'travel': 'Travel',
      'education': 'Education',
      'other': 'Other'
    }
    return nameMap[categoryId] || 'Other'
  }
}
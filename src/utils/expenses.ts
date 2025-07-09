import { supabase } from "../lib/supabase";
import type {
  CreateExpenseData,
  Expense,
  ExpenseWithDetails,
  SplitDetails,
  SplitParticipant,
  UpdateExpenseData,
} from "../types/database";

export const expensesUtils = {
  async getUserExpenses(limit?: number): Promise<ExpenseWithDetails[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("expenses")
      .select(
        `
        *,
        categories (
          id,
          name,
          icon
        ),
        profiles!expenses_paid_by_profile_id_fkey (
          id,
          name
        ),
        groups (
          id,
          name
        )
      `
      )
      .or(
        `paid_by_profile_id.eq.${user.id},involved_profile_ids.cs.{${user.id}}`
      )
      .order("expense_date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching user expenses:", error);
      return [];
    }

    return data.map((expense) => ({
      ...expense,
      category: expense.categories,
      paid_by: expense.profiles,
      group: expense.groups,
    }));
  },

  async getGroupExpenses(
    groupId: string,
    limit?: number
  ): Promise<ExpenseWithDetails[]> {
    let query = supabase
      .from("expenses")
      .select(
        `
        *,
        categories (
          id,
          name,
          icon
        ),
        profiles!expenses_paid_by_profile_id_fkey (
          id,
          name
        )
      `
      )
      .eq("group_id", groupId)
      .eq("is_group_expense", true)
      .order("expense_date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching group expenses:", error);
      return [];
    }

    return data.map((expense) => ({
      ...expense,
      category: expense.categories,
      paid_by: expense.profiles,
    }));
  },

  async getExpense(id: string): Promise<ExpenseWithDetails | null> {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        *,
        categories (
          id,
          name,
          icon
        ),
        profiles!expenses_paid_by_profile_id_fkey (
          id,
          name
        ),
        groups (
          id,
          name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching expense:", error);
      return null;
    }

    // Fetch involved profiles
    const involvedProfiles =
      data.involved_profile_ids?.length > 0
        ? await this.getInvolvedProfiles(data.involved_profile_ids)
        : [];

    return {
      ...data,
      category: data.categories,
      paid_by: data.profiles,
      group: data.groups,
      involved_profiles: involvedProfiles,
    };
  },

  async createExpense(expenseData: CreateExpenseData): Promise<Expense | null> {
    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseData)
      .select()
      .single();

    if (error) {
      console.error("Error creating expense:", error);
      return null;
    }
    return data;
  },

  async updateExpense(expenseData: UpdateExpenseData): Promise<Expense | null> {
    const { id, ...updates } = expenseData;
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating expense:", error);
      return null;
    }
    return data;
  },

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      return false;
    }
    return true;
  },

  async getInvolvedProfiles(profileIds: string[]) {
    if (!profileIds.length) return [];

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", profileIds);

    if (error) {
      console.error("Error fetching involved profiles:", error);
      return [];
    }
    return data;
  },

  async getExpensesByCategory(
    categoryId: string,
    limit?: number
  ): Promise<ExpenseWithDetails[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("expenses")
      .select(
        `
        *,
        categories (
          id,
          name,
          icon
        ),
        profiles!expenses_paid_by_profile_id_fkey (
          id,
          name
        ),
        groups (
          id,
          name
        )
      `
      )
      .eq("category_id", categoryId)
      .or(
        `paid_by_profile_id.eq.${user.id},involved_profile_ids.cs.{${user.id}}`
      )
      .order("expense_date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching expenses by category:", error);
      return [];
    }

    return data.map((expense) => ({
      ...expense,
      category: expense.categories,
      paid_by: expense.profiles,
      group: expense.groups,
    }));
  },

  async getExpensesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ExpenseWithDetails[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    console.log("startDate", startDate);
    console.log("endDate", endDate);

    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        *,
        categories (
          id,
          name,
          icon
        ),
        profiles!expenses_paid_by_profile_id_fkey (
          id,
          name
        ),
        groups (
          id,
          name
        )
      `
      )
      .or(
        `paid_by_profile_id.eq.${user.id},involved_profile_ids.cs.{${user.id}}`
      )
      .gte("expense_date", startDate)
      .lte("expense_date", endDate)
      .order("expense_date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses by date range:", error);
      return [];
    }

    return data.map((expense) => ({
      ...expense,
      category: expense.categories,
      paid_by: expense.profiles,
      group: expense.groups,
    }));
  },

  async getTotalSpentByUser(userId?: string): Promise<number> {
    const targetUserId =
      userId || (await supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return 0;

    const { data, error } = await supabase
      .from("expenses")
      .select("amount")
      .eq("paid_by_profile_id", targetUserId);

    if (error) {
      console.error("Error calculating total spent:", error);
      return 0;
    }

    return data.reduce((total, expense) => total + expense.amount, 0);
  },

  async getTotalSpentByGroup(groupId: string): Promise<number> {
    const { data, error } = await supabase
      .from("expenses")
      .select("amount")
      .eq("group_id", groupId)
      .eq("is_group_expense", true);

    if (error) {
      console.error("Error calculating group total spent:", error);
      return 0;
    }

    return data.reduce((total, expense) => total + expense.amount, 0);
  },

  calculateSplitAmount(expense: Expense, profileId: string): number {
    if (!expense.is_group_expense) return 0;
    if (!expense.involved_profile_ids.includes(profileId)) return 0;

    if (expense.split_details) {
      // Handle new format
      if (
        "participants" in expense.split_details &&
        Array.isArray(expense.split_details.participants)
      ) {
        const participant = expense.split_details.participants.find(
          (p: SplitParticipant) => p.profile_id === profileId
        );
        return participant?.amount || 0;
      }
    }

    // Equal split by default
    return expense.amount / expense.involved_profile_ids.length;
  },

  createEqualSplit(amount: number, profileIds: string[]): SplitDetails {
    const splitAmount = amount / profileIds.length;

    return {
      type: "equal",
      participants: profileIds.map((id) => ({
        profile_id: id,
        amount: splitAmount,
      })),
    };
  },

  createCustomSplit(amounts: Record<string, number>): SplitDetails {
    return {
      type: "custom",
      participants: Object.entries(amounts).map(([profile_id, amount]) => ({
        profile_id,
        amount,
      })),
    };
  },

  createPercentageSplit(
    totalAmount: number,
    percentages: Record<string, number>
  ): SplitDetails {
    return {
      type: "percentage",
      participants: Object.entries(percentages).map(
        ([profile_id, percentage]) => ({
          profile_id,
          amount: Math.round(((totalAmount * percentage) / 100) * 100) / 100,
        })
      ),
    };
  },
};

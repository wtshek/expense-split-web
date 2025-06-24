export interface Profile {
  id: string;
  name?: string;
  created_at: string;
}

export interface SplitParticipant {
  profile_id: string;
  amount: number;
}

export interface SplitDetails {
  type: 'equal' | 'percentage' | 'custom';
  participants: SplitParticipant[];
}

export type LegacySplitDetails = Record<string, number>;

export interface Category {
  id: string;
  name: string;
  icon?: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  created_at: string;
  owner_id?: string;
}

export interface GroupMember {
  group_id: string;
  profile_id: string;
  joined_at: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category_id?: string;
  expense_date: string;
  is_group_expense: boolean;
  group_id?: string;
  paid_by_profile_id?: string;
  involved_profile_ids: string[];
  split_details?: SplitDetails | LegacySplitDetails;
  notes?: string;
  created_at: string;
}

export interface ExpenseWithDetails extends Expense {
  category?: Category;
  paid_by?: Profile;
  group?: Group;
  involved_profiles?: Profile[];
}

export interface GroupWithMembers extends Group {
  owner?: Profile;
  members?: (GroupMember & { profiles?: Profile })[];
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  category_id?: string;
  expense_date?: string;
  is_group_expense: boolean;
  group_id?: string;
  paid_by_profile_id: string;
  involved_profile_ids: string[];
  split_details?: SplitDetails | LegacySplitDetails;
  notes?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string;
}

export interface CreateGroupData {
  name: string;
  owner_id: string;
}

export interface UpdateGroupData extends Partial<CreateGroupData> {
  id: string;
}

export interface CreateProfileData {
  id: string;
  name?: string;
}

export interface UpdateProfileData extends Partial<CreateProfileData> {
  id: string;
}

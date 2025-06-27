import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type {
  Category,
  GroupMember,
  GroupWithMembers,
  Profile,
  SplitParticipant,
  ExpenseWithDetails,
} from "../types/database";
import { categoriesUtils, expensesUtils, groupsUtils } from "../utils";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Toggle } from "./ui/Toggle";

export default function AddExpenseTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [paidByProfileId, setPaidByProfileId] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "percentage">("equal");
  const [notes, setNotes] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [userGroups, setUserGroups] = useState<GroupWithMembers[]>([]);
  const [groupMembers, setGroupMembers] = useState<
    (GroupMember & { profiles?: Profile })[]
  >([]);
  const [percentageSplits, setPercentageSplits] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingExpense, setEditingExpense] =
    useState<ExpenseWithDetails | null>(null);

  useEffect(() => {
    loadData();
    if (user) {
      setPaidByProfileId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (isEditMode && id) {
      loadExpenseForEdit(id);
    }
  }, [isEditMode, id]);

  const loadGroupMembers = useCallback(async () => {
    if (!selectedGroupId) return;

    try {
      const members = await groupsUtils.getGroupMembers(selectedGroupId);
      setGroupMembers(members);

      // Reset paid by to current user if they're in the group
      const currentUserInGroup = members.find(
        (member) => member.profile_id === user?.id
      );
      if (currentUserInGroup && user) {
        setPaidByProfileId(user.id);
      } else if (members.length > 0) {
        setPaidByProfileId(members[0].profile_id);
      }
    } catch (err) {
      console.error("Error loading group members:", err);
    }
  }, [selectedGroupId, user]);

  const initializeEqualPercentages = useCallback(() => {
    if (groupMembers.length === 0) return;

    const equalPercentage = Math.floor(10000 / groupMembers.length) / 100; // Precise to 2 decimal places
    const splits: Record<string, number> = {};

    groupMembers.forEach((member, index) => {
      if (index === groupMembers.length - 1) {
        // Give the last member the remainder to ensure total is exactly 100%
        const currentTotal = Object.values(splits).reduce(
          (sum, val) => sum + val,
          0
        );
        splits[member.profile_id] =
          Math.round((100 - currentTotal) * 100) / 100;
      } else {
        splits[member.profile_id] = equalPercentage;
      }
    });

    setPercentageSplits(splits);
  }, [groupMembers]);

  useEffect(() => {
    if (selectedGroupId) {
      loadGroupMembers();
    } else {
      setGroupMembers([]);
      setPercentageSplits({});
    }
  }, [selectedGroupId, loadGroupMembers]);

  useEffect(() => {
    if (groupMembers.length > 0 && splitType === "percentage") {
      initializeEqualPercentages();
    }
  }, [groupMembers, splitType, initializeEqualPercentages]);

  const loadData = async () => {
    try {
      const [categoriesData, groupsData] = await Promise.all([
        categoriesUtils.getAllCategories(),
        groupsUtils.getUserGroups(),
      ]);
      setCategories(categoriesData);
      setUserGroups(groupsData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const loadExpenseForEdit = async (expenseId: string) => {
    try {
      setLoadingExpense(true);
      const expense = await expensesUtils.getExpense(expenseId);

      if (!expense) {
        setError("Expense not found");
        return;
      }

      setEditingExpense(expense);

      // Prefill form with expense data
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setCategoryId(expense.category_id || "");
      // Ensure YYYY-MM-DD format for date input
      const dateValue = expense.expense_date
        ? expense.expense_date.split("T")[0]
        : new Date().toISOString().split("T")[0];
      setExpenseDate(dateValue);
      setIsGroupExpense(expense.is_group_expense);
      setNotes(expense.notes || "");
      setPaidByProfileId(expense.paid_by_profile_id || "");

      if (expense.is_group_expense && expense.group_id) {
        setSelectedGroupId(expense.group_id);

        // Detect split type from split_details
        if (expense.split_details && Array.isArray(expense.split_details.participants)) {
          if (expense.split_details.type === "percentage") {
            setSplitType("percentage");

            // Set percentage splits
            const splits: Record<string, number> = {};
            expense.split_details.participants.forEach(
              (p: SplitParticipant) => {
                if (expense.amount > 0) {
                  const percentage = (p.amount / expense.amount) * 100;
                  splits[p.profile_id] = Math.round(percentage * 100) / 100;
                }
              }
            );
            setPercentageSplits(splits);
          } else {
            setSplitType("equal");
          }
        }
      }
    } catch (err) {
      console.error("Error loading expense for edit:", err);
      setError("Failed to load expense data");
    } finally {
      setLoadingExpense(false);
    }
  };

  const handlePercentageChange = (profileId: string, percentage: number) => {
    setPercentageSplits((prev) => ({
      ...prev,
      [profileId]: percentage,
    }));
  };

  const getTotalPercentage = () => {
    return Object.values(percentageSplits).reduce((sum, val) => sum + val, 0);
  };

  const calculateSplitDetails = (amountNumber: number) => {
    if (!isGroupExpense || groupMembers.length === 0) return undefined;

    const involvedProfileIds = groupMembers.map((member) => member.profile_id);

    if (splitType === "equal") {
      return expensesUtils.createEqualSplit(amountNumber, involvedProfileIds);
    } else {
      // Percentage split
      return expensesUtils.createPercentageSplit(
        amountNumber,
        percentageSplits
      );
    }
  };

  const calculateOwedAmounts = () => {
    if (!isGroupExpense || !amount || groupMembers.length === 0) return {};

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) return {};

    const splitDetails = calculateSplitDetails(amountNumber);
    if (!splitDetails?.participants) return {};

    const owedAmounts: Record<string, number> = {};

    splitDetails.participants.forEach((participant: SplitParticipant) => {
      if (participant.profile_id !== paidByProfileId) {
        owedAmounts[participant.profile_id] = participant.amount;
      }
    });

    return owedAmounts;
  };

  const handleGroupExpenseToggle = (checked: boolean) => {
    setIsGroupExpense(checked);

    if (checked && userGroups.length > 0) {
      // Auto-select the first group when toggled on
      setSelectedGroupId(userGroups[0].id);
    } else {
      // Reset when toggled off
      setSelectedGroupId("");
      setGroupMembers([]);
      setPercentageSplits({});
      setPaidByProfileId(user?.id || "");
      setSplitType("equal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to add expenses");
      return;
    }

    if (!description.trim() || !amount || !categoryId) {
      setError("Please fill in all required fields");
      return;
    }

    if (isGroupExpense && !selectedGroupId) {
      setError("Please select a group for group expenses");
      return;
    }

    if (isGroupExpense && !paidByProfileId) {
      setError("Please select who paid for this expense");
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (isGroupExpense && splitType === "percentage") {
      const totalPercentage = getTotalPercentage();
      if (Math.abs(totalPercentage - 100) > 0.01) {
        setError(
          `Percentages must add up to 100%. Current total: ${totalPercentage.toFixed(
            2
          )}%`
        );
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const involvedProfileIds = isGroupExpense
        ? groupMembers.map((member) => member.profile_id)
        : [user.id];

      const expenseData = {
        description: description.trim(),
        amount: amountNumber,
        category_id: categoryId,
        expense_date: expenseDate,
        is_group_expense: isGroupExpense,
        group_id: isGroupExpense ? selectedGroupId : undefined,
        paid_by_profile_id: isGroupExpense ? paidByProfileId : user.id,
        involved_profile_ids: involvedProfileIds,
        split_details: calculateSplitDetails(amountNumber),
        notes: notes.trim() || undefined,
      };

      const result =
        isEditMode && editingExpense
          ? await expensesUtils.updateExpense({
              id: editingExpense.id,
              ...expenseData,
            })
          : await expensesUtils.createExpense(expenseData);

      if (result) {
        setSuccess(
          isEditMode
            ? "Expense updated successfully!"
            : "Expense added successfully!"
        );
        // Reset form
        setDescription("");
        setAmount("");
        setCategoryId("");
        setExpenseDate(new Date().toISOString().split("T")[0]);
        setIsGroupExpense(false);
        setSelectedGroupId("");
        setPaidByProfileId(user.id);
        setSplitType("equal");
        setNotes("");
        setGroupMembers([]);
        setPercentageSplits({});

        // Clear success message and navigate back after 2 seconds
        setTimeout(() => {
          setSuccess("");
          if (isEditMode) {
            navigate("/expenses");
          }
        }, 2000);
      } else {
        setError(
          isEditMode
            ? "Failed to update expense. Please try again."
            : "Failed to add expense. Please try again."
        );
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      setError("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingExpense) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {isEditMode ? "Edit Expense" : "Add Expense"}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? "Update your expense details"
                  : "Track your spending and split with groups"}
              </p>
            </div>
            {isEditMode && (
              <button
                onClick={() => navigate("/expenses")}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-gray-800 hover:bg-opacity-30 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-100 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 text-green-100 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="description"
            label="Description *"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />

          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            label="Amount *"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />

          <Select
            id="category"
            label="Category *"
            placeholder="Select a category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading}
            options={categories.map((category) => ({
              value: category.id,
              label: `${category.icon} ${category.name}`,
            }))}
          />

          <Input
            id="date"
            type="date"
            label="Date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            disabled={loading}
          />

          <Toggle
            id="isGroupExpense"
            checked={isGroupExpense}
            onChange={handleGroupExpenseToggle}
            disabled={loading}
            label="This is a group expense"
          />

          {isGroupExpense && (
            <>
              <Select
                id="group"
                label="Select Group *"
                placeholder="Select a group"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={loading}
                options={userGroups.map((group) => ({
                  value: group.id,
                  label: group.name,
                }))}
              />

              {groupMembers.length > 0 && (
                <>
                  <Select
                    id="paidBy"
                    label="Paid By *"
                    value={paidByProfileId}
                    onChange={(e) => setPaidByProfileId(e.target.value)}
                    disabled={loading}
                    options={groupMembers.map((member) => ({
                      value: member.profile_id,
                      label: `${member.profiles?.name || "Unknown"}${
                        member.profile_id === user?.id ? " (You)" : ""
                      }`,
                    }))}
                  />

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Split Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSplitType("equal")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          splitType === "equal"
                            ? "bg-purple-600 text-white"
                            : "bg-white bg-opacity-20 text-gray-800 hover:bg-opacity-30"
                        }`}
                        disabled={loading}
                      >
                        Equal Split
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitType("percentage")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          splitType === "percentage"
                            ? "bg-purple-600 text-white"
                            : "bg-white bg-opacity-20 text-gray-800 hover:bg-opacity-30"
                        }`}
                        disabled={loading}
                      >
                        Custom %
                      </button>
                    </div>
                  </div>

                  {splitType === "percentage" && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20">
                      <h4 className="text-gray-800 font-medium mb-3">
                        Configure Split Percentages
                      </h4>
                      <div className="space-y-3">
                        {groupMembers.map((member) => (
                          <div
                            key={member.profile_id}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-700 text-sm">
                              {member.profiles?.name || "Unknown"}
                              {member.profile_id === user?.id ? " (You)" : ""}
                            </span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={percentageSplits[member.profile_id] || 0}
                                onChange={(e) =>
                                  handlePercentageChange(
                                    member.profile_id,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-20 px-2 py-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300"
                                disabled={loading}
                              />
                              <span className="text-gray-700 text-sm">%</span>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-white border-opacity-20 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-800 font-medium">
                              Total:
                            </span>
                            <span
                              className={`font-medium ${
                                Math.abs(getTotalPercentage() - 100) < 0.01
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {getTotalPercentage().toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {amount && parseFloat(amount) > 0 && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20">
                      <h4 className="text-gray-800 font-medium mb-3">
                        Split Breakdown
                      </h4>
                      <div className="space-y-2">
                        {(() => {
                          const amountNumber = parseFloat(amount);
                          const splitDetails =
                            calculateSplitDetails(amountNumber);
                          const owedAmounts = calculateOwedAmounts();

                          if (!splitDetails?.participants) return null;

                          return groupMembers.map((member) => {
                            const participant = splitDetails.participants.find(
                              (p: SplitParticipant) =>
                                p.profile_id === member.profile_id
                            );
                            const memberAmount = participant?.amount || 0;
                            const owedAmount =
                              owedAmounts[member.profile_id] || 0;
                            const isPayer =
                              member.profile_id === paidByProfileId;

                            return (
                              <div
                                key={member.profile_id}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-700">
                                  {member.profiles?.name || "Unknown"}
                                  {member.profile_id === user?.id
                                    ? " (You)"
                                    : ""}
                                  {isPayer ? " 💳" : ""}
                                </span>
                                <div className="text-right">
                                  <div className="text-gray-800 font-medium">
                                    ${memberAmount.toFixed(2)}
                                  </div>
                                  {!isPayer && owedAmount > 0 && (
                                    <div className="text-xs text-gray-600">
                                      Owes ${owedAmount.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <Input
            id="notes"
            label="Notes"
            placeholder="Additional details (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading || loadingExpense}
            className="w-full"
          >
            {isEditMode ? "Update Expense" : "Add Expense"}
          </Button>
        </form>
      </div>
    </div>
  );
}

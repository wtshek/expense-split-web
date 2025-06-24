import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Category, ExpenseWithDetails, SplitDetails, LegacySplitDetails, SplitParticipant } from "../types/database";
import { categoriesUtils, expensesUtils, groupsUtils } from "../utils";

interface CategoryStats {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

interface DebtInfo {
  groupName: string;
  memberName: string;
  amount: number;
  isOwed: boolean; // true if they owe you, false if you owe them
}

interface PaymentInfo {
  memberName: string;
  groupName: string;
  totalPaid: number;
  expenseCount: number;
}

interface PaymentSummary {
  totalIPaid: number;
  totalOthersPaid: number;
  myPayments: PaymentInfo[];
  othersPayments: PaymentInfo[];
}

export default function StatsTab() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [debts, setDebts] = useState<DebtInfo[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    totalIPaid: 0,
    totalOthersPaid: 0,
    myPayments: [],
    othersPayments: [],
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateCategoryStats = useCallback(async (expenses: ExpenseWithDetails[]) => {
    const categories = await categoriesUtils.getAllCategories();
    const categoryMap = new Map<string, CategoryStats>();

    // Initialize all categories
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        category,
        amount: 0,
        percentage: 0,
        count: 0,
      });
    });

    // Calculate totals per category
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    expenses.forEach((expense) => {
      const categoryId = expense.category_id || "other";
      const existing = categoryMap.get(categoryId);
      if (existing) {
        existing.amount += expense.amount;
        existing.count += 1;
      }
    });

    // Calculate percentages and filter out zero amounts
    const stats = Array.from(categoryMap.values())
      .filter((stat) => stat.amount > 0)
      .map((stat) => ({
        ...stat,
        percentage: total > 0 ? (stat.amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    setCategoryStats(stats);
  }, []);

  const calculateDebts = useCallback(async (expenses: ExpenseWithDetails[]) => {
    if (!user) return;

    const debtMap = new Map<
      string,
      { amount: number; groupName: string; memberName: string }
    >();

    // Process group expenses
    for (const expense of expenses) {
      if (!expense.is_group_expense || !expense.split_details) continue;

      const splitDetails = expense.split_details as SplitDetails | LegacySplitDetails;

      // Handle new format: {type: "equal", participants: [{amount: 100, profile_id: "..."}]}
      if ('participants' in splitDetails && Array.isArray(splitDetails.participants)) {
        const paidByCurrentUser = expense.paid_by_profile_id === user.id;

        // Find current user's split amount
        const currentUserParticipant = splitDetails.participants.find(
          (p: SplitParticipant) => p.profile_id === user.id
        );
        const currentUserSplit = currentUserParticipant?.amount || 0;

        // Process each participant
        for (const participant of splitDetails.participants) {
          const profileId = participant.profile_id;
          const splitAmount = participant.amount;

          if (profileId === user.id) continue;

          const key = `${expense.group_id}-${profileId}`;

          let debtAmount = 0;
          if (paidByCurrentUser) {
            // You paid, they owe you their split
            debtAmount = splitAmount;
          } else if (expense.paid_by_profile_id === profileId) {
            // They paid, you owe them your split
            debtAmount = -currentUserSplit;
          }

          if (debtAmount !== 0) {
            const existing = debtMap.get(key);
            if (existing) {
              existing.amount += debtAmount;
            } else {
              // Get member info
              const group = await groupsUtils.getGroup(expense.group_id!);
              const member = group?.members?.find(
                (m) => m.profile_id === profileId
              );

              if (group && member) {
                debtMap.set(key, {
                  amount: debtAmount,
                  groupName: group.name,
                  memberName: member.profiles?.name || "Unknown",
                });
              }
            }
          }
        }
      } else {
        // Handle old format: {profile_id: amount, profile_id: amount}
        const paidByCurrentUser = expense.paid_by_profile_id === user.id;
        const currentUserSplit = (splitDetails as LegacySplitDetails)[user.id] || 0;

        Object.entries(splitDetails as LegacySplitDetails).forEach(
          async ([profileId, splitAmount]) => {
            if (profileId === user.id) return;

            const key = `${expense.group_id}-${profileId}`;

            let debtAmount = 0;
            if (paidByCurrentUser) {
              // You paid, they owe you their split
              debtAmount = splitAmount as number;
            } else if (expense.paid_by_profile_id === profileId) {
              // They paid, you owe them your split
              debtAmount = -currentUserSplit;
            }

            if (debtAmount !== 0) {
              const existing = debtMap.get(key);
              if (existing) {
                existing.amount += debtAmount;
              } else {
                // Get member info
                const group = await groupsUtils.getGroup(expense.group_id!);
                const member = group?.members?.find(
                  (m) => m.profile_id === profileId
                );

                if (group && member) {
                  debtMap.set(key, {
                    amount: debtAmount,
                    groupName: group.name,
                    memberName: member.profiles?.name || "Unknown",
                  });
                }
              }
            }
          }
        );
      }
    }

    // Convert to debt info array
    const debtsArray: DebtInfo[] = Array.from(debtMap.values())
      .filter((debt) => Math.abs(debt.amount) > 0.01) // Filter out tiny amounts
      .map((debt) => ({
        groupName: debt.groupName,
        memberName: debt.memberName,
        amount: Math.abs(debt.amount),
        isOwed: debt.amount > 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    setDebts(debtsArray);
  }, [user]);

  const calculatePaymentSummary = useCallback(async (expenses: ExpenseWithDetails[]) => {
    if (!user) return;

    const paymentMap = new Map<string, PaymentInfo>();
    let totalIPaid = 0;
    let totalOthersPaid = 0;

    // Process all group expenses to track payments
    for (const expense of expenses) {
      if (!expense.is_group_expense) continue;

      const paidByMe = expense.paid_by_profile_id === user.id;

      if (paidByMe) {
        totalIPaid += expense.amount;
      } else {
        totalOthersPaid += expense.amount;

        // Track who paid what
        const key = `${expense.group_id}-${expense.paid_by_profile_id}`;
        const existing = paymentMap.get(key);

        if (existing) {
          existing.totalPaid += expense.amount;
          existing.expenseCount += 1;
        } else {
          // Get member info
          const group = await groupsUtils.getGroup(expense.group_id!);
          const payer = group?.members?.find(
            (m) => m.profile_id === expense.paid_by_profile_id
          );

          if (group && payer) {
            paymentMap.set(key, {
              memberName: payer.profiles?.name || "Unknown",
              groupName: group.name,
              totalPaid: expense.amount,
              expenseCount: 1,
            });
          }
        }
      }
    }

    // Separate my payments from others
    const myPayments: PaymentInfo[] = [];
    const othersPayments = Array.from(paymentMap.values()).sort(
      (a, b) => b.totalPaid - a.totalPaid
    );

    // Calculate my payments by group
    const myPaymentsByGroup = new Map<string, PaymentInfo>();
    for (const expense of expenses) {
      if (expense.is_group_expense && expense.paid_by_profile_id === user.id) {
        const existing = myPaymentsByGroup.get(expense.group_id!);

        if (existing) {
          existing.totalPaid += expense.amount;
          existing.expenseCount += 1;
        } else {
          const group = await groupsUtils.getGroup(expense.group_id!);
          if (group) {
            myPaymentsByGroup.set(expense.group_id!, {
              memberName: "You",
              groupName: group.name,
              totalPaid: expense.amount,
              expenseCount: 1,
            });
          }
        }
      }
    }

    myPayments.push(
      ...Array.from(myPaymentsByGroup.values()).sort(
        (a, b) => b.totalPaid - a.totalPaid
      )
    );

    setPaymentSummary({
      totalIPaid,
      totalOthersPaid,
      myPayments,
      othersPayments,
    });
  }, [user]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get month range
      const startDate = `${selectedMonth}-01`;
      const endDate = new Date(selectedMonth + "-01");
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
      const endDateStr = endDate.toISOString().split("T")[0];

      // Fetch expenses for the month
      const expenses = await expensesUtils.getExpensesByDateRange(
        startDate,
        endDateStr
      );

      // Calculate category stats
      await calculateCategoryStats(expenses);

      // Calculate debts
      await calculateDebts(expenses);

      // Calculate payment summary
      await calculatePaymentSummary(expenses);

      // Calculate total spent
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, calculateCategoryStats, calculateDebts, calculatePaymentSummary]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, loadStats]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    return new Date(monthStr + "-01").toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#6366F1",
      "#8B5CF6",
      "#F97316",
      "#84CC16",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="max-w-md mx-auto flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-800">Statistics</h1>
          <div className="flex items-center text-gray-600">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <p className="text-sm text-gray-600 mb-2">TOTAL SPENT</p>
          <p className="text-4xl font-bold text-gray-800">
            {formatAmount(totalSpent)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatMonth(selectedMonth)}
          </p>
        </div>

        {/* Category Breakdown */}
        {categoryStats.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white border-opacity-20">
            <h3 className="text-gray-800 font-semibold mb-4">
              Category Breakdown
            </h3>

            <div className="space-y-3">
              {categoryStats.map((stat, index) => (
                <div
                  key={stat.category.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{stat.category.icon}</span>
                    <div>
                      <span className="text-gray-700 text-sm">
                        {stat.category.name}
                      </span>
                      <div className="text-xs text-gray-600">
                        {stat.count} expense{stat.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-800 font-medium mr-2">
                      {formatAmount(stat.amount)}
                    </span>
                    <div
                      className="text-white text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: getCategoryColor(index) }}
                    >
                      {stat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {(paymentSummary.totalIPaid > 0 ||
          paymentSummary.totalOthersPaid > 0) && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white border-opacity-20">
            <h3 className="text-gray-800 font-semibold mb-4">
              Payment Summary
            </h3>

            {/* Payment Totals */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatAmount(paymentSummary.totalIPaid)}
                </div>
                <div className="text-xs text-gray-600">You Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {formatAmount(paymentSummary.totalOthersPaid)}
                </div>
                <div className="text-xs text-gray-600">Others Paid</div>
              </div>
            </div>

            {/* My Payments Breakdown */}
            {paymentSummary.myPayments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-gray-700 font-medium text-sm mb-2">
                  Your Payments
                </h4>
                <div className="space-y-2">
                  {paymentSummary.myPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="text-gray-800">
                          {payment.groupName}
                        </span>
                        <div className="text-xs text-gray-600">
                          {payment.expenseCount} expense
                          {payment.expenseCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {formatAmount(payment.totalPaid)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Others' Payments Breakdown */}
            {paymentSummary.othersPayments.length > 0 && (
              <div>
                <h4 className="text-gray-700 font-medium text-sm mb-2">
                  Others' Payments
                </h4>
                <div className="space-y-2">
                  {paymentSummary.othersPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="text-gray-800">
                          {payment.memberName}
                        </span>
                        <div className="text-xs text-gray-600">
                          {payment.groupName} • {payment.expenseCount} expense
                          {payment.expenseCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <span className="text-purple-400 font-medium">
                        {formatAmount(payment.totalPaid)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Group Debts */}
        {debts.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white border-opacity-20">
            <h3 className="text-gray-800 font-semibold mb-4">
              Settlement Required
            </h3>

            <div className="space-y-3">
              {debts.map((debt, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-800 text-sm font-medium">
                      {debt.isOwed
                        ? `${debt.memberName} owes you`
                        : `You owe ${debt.memberName}`}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {debt.groupName}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      debt.isOwed ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatAmount(debt.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {categoryStats.length === 0 && debts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-gray-800 font-semibold mb-2">
              No data for {formatMonth(selectedMonth)}
            </h3>
            <p className="text-gray-600 text-sm">
              Add some expenses to see your statistics!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

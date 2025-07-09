import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { expensesUtils, formatMonth, getMonthRange } from "../utils";
import ExpenseList from "./ExpenseList";
import { MonthPicker } from "./ui/MonthPicker";

export default function ExpenseTab() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format
  const [totalSpent, setTotalSpent] = useState(0);

  const loadUserStats = useCallback(async () => {
    try {
      // Get month range
      const { startDate, endDate } = getMonthRange(selectedMonth);

      // Fetch expenses for the month to calculate total
      const expenses = await expensesUtils.getExpensesByDateRange(
        startDate,
        endDate
      );

      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
    } catch (err) {
      console.error("Error loading user stats:", err);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };


  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header with greeting and month filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-gray-800">💰</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-800">
                Hello {user?.user_metadata?.name || "there"}!
              </h1>
              <p className="text-sm text-gray-600">Track your expenses</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <div className="w-48">
            <MonthPicker
              value={selectedMonth}
              onChange={setSelectedMonth}
              className="text-sm"
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

        {/* Expenses List */}
        <ExpenseList selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}

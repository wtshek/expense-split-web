import { useEffect, useState } from "react";
import type { ExpenseWithDetails } from "../types/database";
import { categoriesUtils, expensesUtils } from "../utils";

interface ExpenseItemProps {
  expense: ExpenseWithDetails;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryDisplay = () => {
    if (expense.category) {
      return {
        icon:
          expense.category.icon ||
          categoriesUtils.getCategoryIcon(expense.category.id),
        name: expense.category.name,
      };
    }
    return {
      icon: "📦",
      name: "Other",
    };
  };

  const category = getCategoryDisplay();

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <span className="text-lg">{category.icon}</span>
          </div>
          <div>
            <p className="text-gray-800 font-medium">{expense.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{category.name}</span>
              {expense.is_group_expense && expense.group && (
                <span>{expense.group.name}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-800 font-semibold">
            {formatAmount(expense.amount)}
          </p>
          <p className="text-gray-600 text-xs">
            <div>{formatDate(expense.expense_date)}</div>
            <div>
              {expense.paid_by && (
                <span>Paid by {expense.paid_by.name || "Unknown"}</span>
              )}
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}

interface ExpenseListProps {
  selectedMonth?: string;
}

export default function ExpenseList({ selectedMonth }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      
      let data: ExpenseWithDetails[];
      
      if (selectedMonth) {
        // Get month range
        const startDate = `${selectedMonth}-01`;
        const endDate = new Date(selectedMonth + "-01");
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Last day of month
        const endDateStr = endDate.toISOString().split("T")[0];
        
        data = await expensesUtils.getExpensesByDateRange(startDate, endDateStr);
      } else {
        data = await expensesUtils.getUserExpenses(50); // Get last 50 expenses
      }
      
      setExpenses(data);
    } catch (err) {
      console.error("Error loading expenses:", err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
        {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💰</span>
        </div>
        <h3 className="text-gray-800 font-semibold mb-2">No expenses yet</h3>
        <p className="text-gray-600 text-sm">
          Start tracking your expenses by adding your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-semibold">Your Expenses</h3>
        <span className="text-gray-600 text-sm">
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
        </span>
      </div>

      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}

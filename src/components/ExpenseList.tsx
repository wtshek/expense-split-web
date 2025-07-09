import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ExpenseWithDetails } from "../types/database";
import { expensesUtils } from "../utils";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import SwipeableExpenseItem from "./SwipeableExpenseItem";

interface ExpenseListProps {
  selectedMonth?: string;
}

export default function ExpenseList({ selectedMonth }: ExpenseListProps) {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] =
    useState<ExpenseWithDetails | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);

      let data: ExpenseWithDetails[];

      if (selectedMonth) {
        // Get month range
        const startDate = `${selectedMonth}-01`;
        const [year, month] = selectedMonth.split('-').map(Number);
        const endDate = new Date(year, month, 0); // Last day of selected month
        const endDateStr = endDate.getFullYear() + '-' + 
          String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(endDate.getDate()).padStart(2, '0');

        data = await expensesUtils.getExpensesByDateRange(
          startDate,
          endDateStr
        );
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
  }, [selectedMonth]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleEdit = (expense: ExpenseWithDetails) => {
    navigate(`/add-expense/${expense.id}`);
  };

  const handleDelete = (expense: ExpenseWithDetails) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      setDeleting(true);
      const success = await expensesUtils.deleteExpense(expenseToDelete.id);

      if (success) {
        setExpenses((prev) =>
          prev.filter((exp) => exp.id !== expenseToDelete.id)
        );
        setDeleteModalOpen(false);
        setExpenseToDelete(null);
      } else {
        setError("Failed to delete expense. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
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
        <SwipeableExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        expense={expenseToDelete}
        loading={deleting}
      />
    </div>
  );
}

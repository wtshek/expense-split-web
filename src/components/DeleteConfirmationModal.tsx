import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import type { ExpenseWithDetails } from "../types/database";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expense: ExpenseWithDetails | null;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  expense,
  loading = false,
}: DeleteConfirmationModalProps) {
  if (!expense) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Expense">
      <div className="space-y-4">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
          <p className="font-medium mb-2">Are you sure you want to delete this expense?</p>
          <p className="text-sm">This action cannot be undone.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Description:</span>
              <span className="text-gray-800 font-medium">{expense.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="text-gray-800 font-medium">{formatAmount(expense.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="text-gray-800 font-medium">
                {expense.category ? `${expense.category.icon} ${expense.category.name}` : "Other"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-800 font-medium">
                {new Date(expense.expense_date).toLocaleDateString()}
              </span>
            </div>
            {expense.is_group_expense && expense.group && (
              <div className="flex justify-between">
                <span className="text-gray-600">Group:</span>
                <span className="text-gray-800 font-medium">{expense.group.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
import { useState, useRef, TouchEvent, useEffect } from "react";
import type { ExpenseWithDetails } from "../types/database";
import { categoriesUtils } from "../utils";

interface SwipeableExpenseItemProps {
  expense: ExpenseWithDetails;
  onEdit: (expense: ExpenseWithDetails) => void;
  onDelete: (expense: ExpenseWithDetails) => void;
}

export default function SwipeableExpenseItem({
  expense,
  onEdit,
  onDelete,
}: SwipeableExpenseItemProps) {
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const swipeThreshold = 80;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSwipedLeft(false);
      }
    };

    if (isSwipedLeft) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwipedLeft]);

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

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe && !isSwipedLeft) {
      setIsSwipedLeft(true);
    } else if (isRightSwipe && isSwipedLeft) {
      setIsSwipedLeft(false);
    }
    
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleEdit = () => {
    setIsSwipedLeft(false);
    onEdit(expense);
  };

  const handleDelete = () => {
    setIsSwipedLeft(false);
    onDelete(expense);
  };

  const category = getCategoryDisplay();

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl">
      {/* Action buttons - shown when swiped */}
      <div
        className={`absolute right-0 top-0 h-full flex transition-transform duration-300 ${
          isSwipedLeft ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ minHeight: "80px" }}
      >
        <button
          onClick={handleEdit}
          className="bg-blue-500 text-white w-16 h-full flex items-center justify-center transition-colors hover:bg-blue-600"
        >
          <span className="text-lg">✏️</span>
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white w-16 h-full flex items-center justify-center transition-colors hover:bg-red-600 rounded-r-2xl"
        >
          <span className="text-lg">🗑️</span>
        </button>
      </div>

      {/* Main expense item */}
      <div
        className={`bg-white bg-opacity-10 backdrop-blur-lg p-4 border border-white border-opacity-20 transition-all duration-300 ${
          isSwipedLeft ? "-translate-x-32 rounded-l-2xl" : "translate-x-0 rounded-2xl"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ minHeight: "80px" }}
      >
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
            <div className="text-gray-600 text-xs space-y-1">
              <div>{formatDate(expense.expense_date)}</div>
              <div>
                {expense.paid_by && (
                  <span>Paid by {expense.paid_by.name || "Unknown"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe indicator */}
      {isSwipedLeft && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white bg-opacity-50 px-2 py-1 rounded z-10">
          Swipe right to close
        </div>
      )}
    </div>
  );
}
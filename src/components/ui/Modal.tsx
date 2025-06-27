import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto border border-white border-opacity-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-gray-800 hover:bg-opacity-30 transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
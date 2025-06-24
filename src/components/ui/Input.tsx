import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-1 border-black border-opacity-30 rounded-xl text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
          {...props}
        />
        {error && <p className="text-red-100 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

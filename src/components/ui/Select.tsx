import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
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
        <select
          ref={ref}
          className={`w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-1 border-black border-opacity-30 rounded-xl text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-100 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
import { forwardRef } from 'react'

interface ToggleProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ id, checked, onChange, disabled = false, label, className = '' }, ref) => {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out flex items-center ${
              disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
            } ${
              checked
                ? 'bg-purple-600'
                : 'bg-white bg-opacity-20 border border-white border-opacity-30'
            }`}
            onClick={() => !disabled && onChange(!checked)}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                checked ? 'translate-x-5' : 'translate-x-0.5'
              } ${
                disabled ? 'opacity-50' : ''
              }`}
            />
          </div>
        </div>
        {label && (
          <label
            htmlFor={id}
            className={`text-gray-700 text-sm font-medium ${
              disabled ? 'opacity-50' : 'cursor-pointer'
            }`}
            onClick={() => !disabled && onChange(!checked)}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
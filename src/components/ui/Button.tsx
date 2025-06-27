import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center'
    
    const variantClasses = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondary: 'bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 backdrop-blur-sm border border-white border-opacity-30',
      ghost: 'text-gray-700 hover:text-gray-800 hover:bg-white hover:bg-opacity-10'
    }
    
    const sizeClasses = {
      sm: 'py-2 px-3 text-sm',
      md: 'py-3 px-4',
      lg: 'py-4 px-6 text-lg'
    }
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
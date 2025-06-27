import { useState, useEffect, useRef } from 'react';

interface MonthPickerProps {
  value: string; // YYYY-MM format
  onChange: (month: string) => void;
  className?: string;
}

export function MonthPicker({ value, onChange, className = '' }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    return value ? parseInt(value.split('-')[0]) : new Date().getFullYear();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also close on escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const currentMonth = value ? parseInt(value.split('-')[1]) : new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth() + 1;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatDisplayValue = () => {
    if (!value) return 'Select Month';
    const [year, month] = value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleMonthSelect = (monthIndex: number) => {
    const monthStr = (monthIndex + 1).toString().padStart(2, '0');
    const newValue = `${viewYear}-${monthStr}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const isMonthDisabled = (monthIndex: number) => {
    // Disable future months
    if (viewYear > currentYear) return true;
    if (viewYear === currentYear && monthIndex + 1 > currentMonthIndex) return true;
    return false;
  };

  const isMonthSelected = (monthIndex: number) => {
    return viewYear.toString() === value?.split('-')[0] && 
           (monthIndex + 1) === currentMonth;
  };

  const canGoToPrevYear = () => {
    return viewYear > currentYear - 2; // Allow 2 years back
  };

  const canGoToNextYear = () => {
    return viewYear < currentYear;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-1 border-black border-opacity-30 rounded-xl text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-colors text-sm flex items-center justify-between min-h-[48px]"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none'
        }}
      >
        <span>{formatDisplayValue()}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl border border-white border-opacity-30 shadow-lg z-20 p-4">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setViewYear(viewYear - 1)}
                disabled={!canGoToPrevYear()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white bg-opacity-20 text-gray-800 hover:bg-opacity-30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              
              <h3 className="text-lg font-semibold text-gray-800">
                {viewYear}
              </h3>
              
              <button
                type="button"
                onClick={() => setViewYear(viewYear + 1)}
                disabled={!canGoToNextYear()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white bg-opacity-20 text-gray-800 hover:bg-opacity-30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const isSelected = isMonthSelected(index);
                const isDisabled = isMonthDisabled(index);
                
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => !isDisabled && handleMonthSelect(index)}
                    disabled={isDisabled}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isSelected 
                        ? 'bg-purple-600 text-white' 
                        : isDisabled
                          ? 'text-gray-400 cursor-not-allowed opacity-50'
                          : 'text-gray-800 hover:bg-white hover:bg-opacity-30 bg-white bg-opacity-10'
                      }
                    `}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
            
            {/* Current Month Indicator */}
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <div className="text-xs text-gray-600 text-center">
                Current: {months[currentMonthIndex - 1]} {currentYear}
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
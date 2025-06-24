export default function ExpenseTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Expenses</h1>
        
        <div className="mb-6">
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add New Expense
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Lunch at Pizza Place</h3>
              <span className="text-lg font-semibold text-gray-900">$48.50</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Split between 3 people</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Dec 23, 2024</span>
              <span className="text-sm font-medium text-green-600">You paid</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">Movie Tickets</h3>
              <span className="text-lg font-semibold text-gray-900">$36.00</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Split between 2 people</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Dec 22, 2024</span>
              <span className="text-sm font-medium text-orange-600">You owe $18.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
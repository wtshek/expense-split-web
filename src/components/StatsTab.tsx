export default function StatsTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-green-600">$124.50</p>
            <p className="text-sm text-gray-500">You're owed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <p className="text-2xl font-bold text-red-600">$87.25</p>
            <p className="text-sm text-gray-500">You owe</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h3 className="font-medium text-gray-900 mb-3">This Month</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <span className="text-sm font-medium">$486.75</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Your Share</span>
              <span className="text-sm font-medium">$243.38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transactions</span>
              <span className="text-sm font-medium">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">Top Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Food & Dining</span>
              </div>
              <span className="text-sm font-medium">$186.50</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Entertainment</span>
              </div>
              <span className="text-sm font-medium">$124.25</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Transportation</span>
              </div>
              <span className="text-sm font-medium">$76.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ExpenseTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header with greeting */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-gray-800">H</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-800">Hello Hilya!</h1>
              <p className="text-sm text-gray-600">Welcome back</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-gray-800 text-lg">🔔</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <p className="text-sm text-gray-600 mb-2">YOUR BALANCE</p>
          <div className="flex items-center mb-6">
            <span className="text-4xl font-bold text-gray-800">$41,379.00</span>
            <div className="ml-2 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-gray-800 text-xs">ⓘ</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-lg">↑</span>
              </div>
              <span className="text-xs text-gray-700">Transfer</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-lg">↓</span>
              </div>
              <span className="text-xs text-gray-700">Withdraw</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-lg">📈</span>
              </div>
              <span className="text-xs text-gray-700">Invest</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-lg">💳</span>
              </div>
              <span className="text-xs text-gray-700">Top up</span>
            </div>
          </div>
        </div>

        {/* Financial Insight Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">📊</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm">Let's check your Financial</p>
                <p className="text-gray-800 font-medium text-sm">Insight for the month of June!</p>
              </div>
            </div>
            <div className="text-gray-600">
              <span className="text-lg">›</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">▶</span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Youtube</p>
                    <p className="text-gray-600 text-sm">Subscription Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold">$15.00</p>
                  <p className="text-gray-600 text-xs">16 May 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Stripe</p>
                    <p className="text-gray-600 text-sm">Monthly Salary</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+$3,000</p>
                  <p className="text-white opacity-70 text-xs">15 May 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">▶</span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Google Play</p>
                    <p className="text-gray-600 text-sm">E-book Purchase</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold">$139.00</p>
                  <p className="text-gray-600 text-xs">14 May 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">O</span>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">OVO</p>
                    <p className="text-gray-600 text-sm">Top Up E-Money</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold">$180.00</p>
                  <p className="text-gray-600 text-xs">18 May 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
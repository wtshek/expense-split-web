export default function ProfileTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-800 text-lg">←</div>
          <div className="text-gray-600 text-sm">9:41</div>
        </div>

        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute -top-4 -right-8 w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-6 -left-8 w-1 h-1 bg-pink-400 rounded-full"></div>
            <div className="absolute -bottom-4 -right-6 w-2 h-2 bg-green-400 rounded-full"></div>
            
            {/* Success checkmark */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">OVO Top up Successful!</h1>
          <p className="text-gray-600">Successfully topped up $180 to Tanjiiro</p>
        </div>

        {/* Transaction Details Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <h3 className="text-gray-800 font-semibold mb-4">Detail Transaction</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID</span>
              <span className="text-gray-800 font-medium">7238 1121 2830</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date</span>
              <span className="text-gray-800 font-medium">08:16   18 May 2024</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Type of Transaction</span>
              <span className="text-gray-800 font-medium">Top up e-money</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nominal</span>
              <span className="text-gray-800 font-medium">$180</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admin</span>
              <span className="text-gray-800 font-medium">$0.5</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recipient's number</span>
              <span className="text-gray-800 font-medium">+62 813 8164 3328</span>
            </div>
            
            <div className="border-t border-white border-opacity-20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 font-medium">Success</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white border-opacity-20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-gray-800 font-bold text-lg">$180.05</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-colors">
            Download Receipt
          </button>
          
          <button className="w-full bg-white bg-opacity-10 backdrop-blur-lg text-white py-4 px-6 rounded-2xl font-semibold border border-white border-opacity-20 hover:bg-opacity-20 transition-colors">
            Share Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
export default function StatsTab() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-800 text-lg">←</div>
          <h1 className="text-lg font-semibold text-gray-800">Statistic</h1>
          <div className="flex items-center text-gray-600">
            <span className="text-sm mr-1">May 2024</span>
            <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Income/Outcome Toggle */}
        <div className="flex bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-1 mb-6 border border-white border-opacity-20">
          <button className="flex-1 py-2 px-4 text-gray-800 font-medium rounded-lg bg-white bg-opacity-20 transition-all">
            Income
          </button>
          <button className="flex-1 py-2 px-4 text-gray-600 font-medium rounded-lg transition-all">
            Outcome
          </button>
        </div>

        {/* Circular Chart */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Outer circle background */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circles */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#8B5CF6"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${50 * 2.51} ${251.2 - (50 * 2.51)}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#EC4899"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${18 * 2.51} ${251.2 - (18 * 2.51)}`}
                strokeDashoffset={`-${50 * 2.51}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#06B6D4"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${17 * 2.51} ${251.2 - (17 * 2.51)}`}
                strokeDashoffset={`-${(50 + 18) * 2.51}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#1E293B"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${15 * 2.51} ${251.2 - (15 * 2.51)}`}
                strokeDashoffset={`-${(50 + 18 + 17) * 2.51}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-xs mb-1">TOTAL INCOME</p>
              <p className="text-gray-800 text-2xl font-bold">$20,173.00</p>
            </div>
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white border-opacity-20">
          <h3 className="text-gray-800 font-semibold mb-4">Income Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Monthly Salary</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium mr-2">$10,086.50</span>
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">50%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Passive Income</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium mr-2">$3,631.14</span>
                <div className="bg-pink-500 text-white text-xs px-2 py-1 rounded">18%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Freelance</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium mr-2">$3,429.41</span>
                <div className="bg-cyan-500 text-white text-xs px-2 py-1 rounded">17%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Side Business</span>
              <div className="flex items-center">
                <span className="text-gray-800 font-medium mr-2">$3,025.95</span>
                <div className="bg-slate-700 text-white text-xs px-2 py-1 rounded">15%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
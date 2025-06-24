import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/stats', label: 'Stat', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '👤' }
];

export default function TabNavigation() {
  return (
    <div className="flex bg-white bg-opacity-10 backdrop-blur-lg border-t border-white border-opacity-20 mx-4 mb-4 rounded-2xl">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex-1 py-4 px-2 text-center text-xs font-medium transition-all flex flex-col items-center ${
              isActive
                ? 'text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${
                isActive ? 'bg-purple-600' : ''
              }`}>
                <span className="text-lg">{tab.icon}</span>
              </div>
              <span>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
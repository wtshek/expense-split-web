import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/expenses', label: 'Expenses' },
  { path: '/stats', label: 'Stats' },
  { path: '/profile', label: 'Profile' }
];

export default function TabNavigation() {
  return (
    <div className="flex border-t border-gray-200 bg-white">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex-1 py-4 px-2 text-center text-sm font-medium transition-colors ${
              isActive
                ? 'text-blue-600 border-t-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
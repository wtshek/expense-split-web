import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from './components/TabNavigation';
import ExpenseTab from './components/ExpenseTab';
import StatsTab from './components/StatsTab';
import ProfileTab from './components/ProfileTab';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/expenses" replace />} />
          <Route path="/expenses" element={<ExpenseTab />} />
          <Route path="/stats" element={<StatsTab />} />
          <Route path="/profile" element={<ProfileTab />} />
        </Routes>
      </div>
      <TabNavigation />
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/Auth/AuthPage';
import TabNavigation from './components/TabNavigation';
import ExpenseTab from './components/ExpenseTab';
import AddExpenseTab from './components/AddExpenseTab';
import StatsTab from './components/StatsTab';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--purple-gradient)' }}>
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/expenses" replace />} />
          <Route path="/expenses" element={<ExpenseTab />} />
          <Route path="/add-expense" element={<AddExpenseTab />} />
          <Route path="/stats" element={<StatsTab />} />
        </Routes>
      </div>
      <TabNavigation />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

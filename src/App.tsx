import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import TabNavigation from './components/TabNavigation';
import ExpenseTab from './components/ExpenseTab';
import StatsTab from './components/StatsTab';
import ProfileTab from './components/ProfileTab';

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
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ExpenseTab />} />
          <Route path="/stats" element={<StatsTab />} />
          <Route path="/profile" element={<ProfileTab />} />
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

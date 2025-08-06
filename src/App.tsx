import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { testSupabaseConnection } from './lib/api';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Cruze from './pages/Cruze';
import LiveNow from './pages/LiveNow';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

// Demo user for testing
const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  university: 'Purdue University',
  avatar: undefined,
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      console.log('🔍 [App] Checking database connection...');
      const isConnected = await testSupabaseConnection();
      
      if (isConnected) {
        console.log('✅ [App] Database connected successfully');
        setDbConnectionStatus('connected');
        setIsDemoMode(false);
      } else {
        console.log('⚠️ [App] Database connection failed, using demo mode');
        setDbConnectionStatus('failed');
        setIsDemoMode(true);
      }
    };

    checkDatabaseConnection();
  }, []);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/explore') return 'explore';
    if (path === '/cruze') return 'cruze';
    if (path === '/live') return 'live';
    if (path === '/messages') return 'messages';
    return 'home';
  };

  const handleTabChange = (tab: string) => {
    console.log('🔍 [App] Tab change requested:', tab);
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'cruze':
        navigate('/cruze');
        break;
      case 'live':
        navigate('/live');
        break;
      case 'messages':
        navigate('/messages');
        break;
      default:
        navigate('/');
    }
  };

  // Show loading while checking database
  if (dbConnectionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-dark-600">Checking database connection...</p>
        </div>
      </div>
    );
  }

  // Show login if no user
  if (!currentUser && !isDemoMode) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {isDemoMode && (
        <div className="bg-lightOrange-100 border-b border-lightOrange-200 px-4 py-2 text-center">
          <p className="text-orange-700 text-sm">
            🚀 <strong>Demo Mode:</strong> Running without Supabase. Sign up for full features!
          </p>
        </div>
      )}
      
      {dbConnectionStatus === 'connected' && (
        <div className="bg-lightBlue-100 border-b border-lightBlue-200 px-4 py-2 text-center">
          <p className="text-blue-700 text-sm">
            ✅ <strong>Database Connected:</strong> All features are live!
          </p>
        </div>
      )}
      
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore currentUser={currentUser || DEMO_USER} />} />
          <Route path="/cruze" element={<Cruze currentUser={currentUser || DEMO_USER} />} />
          <Route path="/live" element={<LiveNow currentUser={currentUser || DEMO_USER} />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
        <Navigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Router>
  );
}

export default App; 
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Profile from './pages/Profile';
// import Login from './pages/Login'; // Skipped for demo
import CreateTicket from './pages/CreateTicket';
import Saved from './pages/Saved';
import TicketDetail from './pages/TicketDetail';
import { queryClient } from './lib/queryClient';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './lib/store';
import type { User } from './types';

// Mock user for development/demo purposes
const MOCK_USER: User = {
  id: 'demo-user-123',
  email: 'demo@iu.edu',
  name: 'Demo User',
  university: 'Indiana University',
  campus_id: 'iu-campus-id',
  date_of_birth: '2000-01-01',
  avatar: null,
  reputation_score: 85,
  successful_sales: 12,
  is_edu_email: true,
  email_verified: true,
  verified: true,
  is_banned: false,
  ban_reason: null,
  banned_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  snapchat_handle: null,
  instagram_handle: null,
  phone_number: null,
};

// Create a context to provide mock user to pages
const MockUserContext = React.createContext<User | null>(null);

// Hook to get user - checks mock context first, then auth
export const useUser = () => {
  const mockUser = React.useContext(MockUserContext);
  const { currentUser } = useAuth();
  return mockUser || currentUser;
};

const AppContent: React.FC = () => {
  const setCurrentUser = useAppStore(state => state.setCurrentUser);
  
  // Set mock user in store for demo (bypass login)
  useEffect(() => {
    setCurrentUser(MOCK_USER);
  }, [setCurrentUser]);

  // Handle email verification redirect and check session
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check for auth hash in URL (from email verification)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.get('type') === 'recovery' || hashParams.get('type') === 'signup') {
          // Clear the hash to clean up URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (err) {
        // Silently handle - not critical
      }
    };
    
    handleAuthRedirect();
  }, []);

  // Skip loading state for demo
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
  //         <p className="text-[#0E1F33] font-medium">Loading TicketPlug...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Skip login for demo
  // if (!currentUser) {
  //   return <Login />;
  // }

  return (
    <MockUserContext.Provider value={MOCK_USER}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex justify-center overflow-hidden">
        <div className="w-full max-w-4xl bg-white shadow-2xl relative overflow-hidden pb-20">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <Navigation />
        </div>
      </div>
    </MockUserContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 
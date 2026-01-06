import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import CreateTicket from './pages/CreateTicket';
import Saved from './pages/Saved';
import TicketDetail from './pages/TicketDetail';
import { queryClient } from './lib/queryClient';
import { AnimatePresence } from 'framer-motion';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  // Handle email verification redirect
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

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading TicketPlug...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  // Protected routes - user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex justify-center overflow-hidden">
      <div className="w-full max-w-4xl bg-white shadow-2xl relative overflow-hidden pb-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
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
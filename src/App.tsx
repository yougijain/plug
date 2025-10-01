import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  // Test Supabase connection on app start
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { error } = await supabase
          .from('posts')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('❌ Supabase connection failed:', error);
        } else {
          console.log('✅ Supabase connected successfully');
        }
      } catch (err) {
        console.error('❌ Failed to test Supabase connection:', err);
      }
    };
    
    testConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-[#0E1F33] font-medium">Loading Plug...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
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
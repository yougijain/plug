import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LiveNow from './pages/LiveNow';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Post from './pages/Post';
import Cart from './pages/Cart';
import Saved from './pages/Saved';
import { queryClient } from './lib/queryClient';
import { useAppStore } from './lib/store';
import { AnimatePresence } from 'framer-motion';

// Demo user for development
const DEMO_USER = {
  id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  university: 'Purdue University',
  avatar: null,
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Test Supabase connection on app start
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
          .from('posts')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('❌ Supabase connection failed:', error);
          setIsSupabaseConnected(false);
        } else {
          console.log('✅ Supabase connected successfully');
          setIsSupabaseConnected(true);
        }
      } catch (err) {
        console.error('❌ Failed to test Supabase connection:', err);
        setIsSupabaseConnected(false);
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
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-2xl relative overflow-hidden pb-20">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveNow currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/post" element={<Post />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/saved" element={<Saved />} />
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
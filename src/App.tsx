import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import DemoNotice from './components/DemoNotice';
import DesktopFrame from './components/DesktopFrame';
import Home from './pages/Home';
import LiveNow from './pages/LiveNow';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Post from './pages/Post';
import Cart from './pages/Cart';
import Saved from './pages/Saved';
import PostDetail from './pages/PostDetail';
import { queryClient } from './lib/queryClient';
import { AnimatePresence } from 'framer-motion';
import { checkBackend } from './lib/api';
import { isDemoMode } from './lib/env';
import { log, warn } from './lib/logger';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  // Confirm the active backend (demo or Supabase) is reachable at startup.
  useEffect(() => {
    checkBackend().then((result) => {
      if (result.success) log(`[backend:${result.mode}] ${result.message}`);
      else warn(`[backend:${result.mode}] ${result.message}`);
    });
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
    /*
     * The centre column is exactly max-w-md (28rem) on large screens, so the
     * viewport-centred bottom navigation stays aligned with the app itself
     * while the context panel sits in the left track.
     */
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center lg:grid lg:grid-cols-[1fr_28rem_1fr]">
      <DesktopFrame />
      <div className="w-full max-w-md bg-white shadow-2xl relative overflow-hidden pb-20 lg:justify-self-center">
        {isDemoMode && <DemoNotice />}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveNow currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/post" element={<Post />} />
            <Route path="/post/:id" element={<PostDetail />} />
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

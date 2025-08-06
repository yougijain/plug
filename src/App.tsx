import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Cruze from './pages/Cruze';
import LiveNow from './pages/LiveNow';
import Messages from './pages/Messages';
import Login from './pages/Login';
import { User } from './types/index';

// Component to handle navigation state
function AppContent({ currentUser }: { currentUser: User }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on current route
  const getActiveTab = (): 'home' | 'explore' | 'cruze' | 'live' | 'messages' => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/explore') return 'explore';
    if (path === '/cruze') return 'cruze';
    if (path === '/live') return 'live';
    if (path === '/messages') return 'messages';
    return 'home';
  };

  const handleTabChange = (tab: 'home' | 'explore' | 'cruze' | 'live' | 'messages') => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
          <Route path="/home" element={<Home currentUser={currentUser} />} />
          <Route path="/explore" element={<Explore currentUser={currentUser} />} />
          <Route path="/cruze" element={<Cruze currentUser={currentUser} />} />
          <Route path="/live" element={<LiveNow currentUser={currentUser} />} />
          <Route path="/messages" element={<Messages currentUser={currentUser} />} />
        </Routes>
        <Navigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <Router>
      <AppContent currentUser={currentUser} />
    </Router>
  );
}

export default App; 
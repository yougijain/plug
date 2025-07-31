import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Cruze from './pages/Cruze';
import LiveNow from './pages/LiveNow';
import Messages from './pages/Messages';
import Login from './pages/Login';
import { User } from './types/index';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'cruze' | 'live' | 'messages'>('home');

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/explore" element={<Explore currentUser={currentUser} />} />
            <Route path="/cruze" element={<Cruze currentUser={currentUser} />} />
            <Route path="/live" element={<LiveNow currentUser={currentUser} />} />
            <Route path="/messages" element={<Messages currentUser={currentUser} />} />
          </Routes>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </Router>
  );
}

export default App; 
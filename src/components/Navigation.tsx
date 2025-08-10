import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabType } from '../types/index';
import { 
  HomeIcon, 
  BoltIcon, 
  PlusIcon, 
  UserCircleIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/live') return 'live';
    if (path === '/post') return 'post';
    if (path === '/profile') return 'profile';
    if (path === '/messages') return 'messages';
    return 'home';
  };

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'live':
        navigate('/live');
        break;
      case 'post':
        navigate('/post');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'messages':
        navigate('/messages');
        break;
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E6E9EE] px-4 py-2 z-50">
      <div className="flex items-center justify-around relative">
        {/* Home Tab */}
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            activeTab === 'home' ? 'text-[#FF6B35]' : 'text-gray-500'
          }`}
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* Live Tab */}
        <button
          onClick={() => handleTabChange('live')}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            activeTab === 'live' ? 'text-[#FF6B35]' : 'text-gray-500'
          }`}
        >
          <BoltIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Live</span>
        </button>

        {/* FAB - Post Button */}
        <div className="relative -top-4">
          <button
            onClick={() => handleTabChange('post')}
            className="w-14 h-14 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-10 relative"
            style={{
              boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
            }}
          >
            <PlusIcon className="h-6 w-6 text-white" />
          </button>
          {/* Subtle pulse animation every 5 seconds */}
          <div className="absolute inset-0 rounded-full bg-[#FF6B35] opacity-20 animate-ping z-0" style={{ animationDuration: '5s', animationIterationCount: 'infinite' }}></div>
        </div>

        {/* Profile Tab */}
        <button
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            activeTab === 'profile' ? 'text-[#FF6B35]' : 'text-gray-500'
          }`}
        >
          <UserCircleIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>

        {/* Messages Tab */}
        <button
          onClick={() => handleTabChange('messages')}
          className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
            activeTab === 'messages' ? 'text-[#FF6B35]' : 'text-gray-500'
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Messages</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation; 
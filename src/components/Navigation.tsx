import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabType } from '../types/index';
import { motion } from 'framer-motion';
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
    <div className="fixed bottom-0 left-0 right-0 px-4 py-2 z-50">
      <div className="relative mx-auto max-w-md">
        <div className="bg-white border-t border-[#E6E9EE] px-4 py-2 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-5 items-end">
            {/* Home Tab */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                activeTab === 'home' ? 'text-[#FF6B35]' : 'text-gray-500'
              }`}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </motion.button>

            {/* Live Tab */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('live')}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                activeTab === 'live' ? 'text-[#FF6B35]' : 'text-gray-500'
              }`}
            >
              <BoltIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Live</span>
            </motion.button>

            {/* FAB - Center Column */}
            <div className="flex items-center justify-center relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTabChange('post')}
                className="w-14 h-14 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-10 relative -translate-y-3"
                style={{ boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)' }}
                aria-label="Create Post"
              >
                <PlusIcon className="h-6 w-6 text-white" />
              </motion.button>
              <div className="absolute w-14 h-14 rounded-full bg-[#FF6B35] opacity-20 animate-ping z-0 -translate-y-3" style={{ animationDuration: '5s', animationIterationCount: 'infinite' }}></div>
            </div>

            {/* Profile Tab */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('profile')}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                activeTab === 'profile' ? 'text-[#FF6B35]' : 'text-gray-500'
              }`}
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </motion.button>

            {/* Messages Tab */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('messages')}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                activeTab === 'messages' ? 'text-[#FF6B35]' : 'text-gray-500'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Messages</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 
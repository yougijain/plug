import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  PlusIcon, 
  HeartIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

type TabType = 'home' | 'create' | 'saved' | 'profile';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/create-ticket') return 'create';
    if (path === '/saved') return 'saved';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'create':
        navigate('/create-ticket');
        break;
      case 'saved':
        navigate('/saved');
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-2 z-50">
      <div className="relative mx-auto max-w-4xl">
        <div className="bg-white border-t border-gray-200 px-4 py-2 rounded-t-2xl shadow-[0_-4px_20px_rgba(99,102,241,0.1)]">
          <div className="grid grid-cols-4 items-end gap-2">
            {/* Home Tab */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                activeTab === 'home' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </motion.button>

            {/* Saved Tab */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('saved')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                activeTab === 'saved' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <HeartIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Saved</span>
            </motion.button>

            {/* Create Tab (FAB) */}
            <div className="flex items-center justify-center relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTabChange('create')}
                className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 relative -translate-y-2"
                style={{ boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}
                aria-label="Create Ticket"
              >
                <PlusIcon className="h-7 w-7 text-white stroke-2" />
              </motion.button>
            </div>

            {/* Profile Tab */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange('profile')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                activeTab === 'profile' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

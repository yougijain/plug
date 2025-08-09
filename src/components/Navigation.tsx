import React from 'react';
import { HomeIcon, BoltIcon, ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TabType } from '../types/index';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  // tabs reserved for future expansion

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-200">
      <div className="relative h-16">
        {/* Evenly spaced 5 columns: Home | Live | spacer | Profile | Messages */}
        <div className="grid grid-cols-5 h-full items-center text-xs font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center ${
              activeTab === 'home' ? 'text-brandOrange' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <HomeIcon className="h-6 w-6 mb-1" />
            Home
          </button>
          <button
            onClick={() => onTabChange('live')}
            className={`flex flex-col items-center ${
              activeTab === 'live' ? 'text-brandOrange' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <BoltIcon className="h-6 w-6 mb-1" />
            Live
          </button>
          <div />
          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center ${
              activeTab === 'profile' ? 'text-brandOrange' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <div className="h-6 w-6 mb-1 rounded-full bg-brandMint text-brandNavy flex items-center justify-center text-[10px] font-bold">U</div>
            Profile
          </button>
          <button
            onClick={() => onTabChange('messages')}
            className={`flex flex-col items-center ${
              activeTab === 'messages' ? 'text-brandOrange' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6 mb-1" />
            Messages
          </button>
        </div>
        {/* Center FAB */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={() => onTabChange('post')}
            className="pointer-events-auto -mt-8 h-14 w-14 rounded-full bg-brandOrange text-white shadow-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition fab-pulse"
            aria-label="Post"
          >
            <PlusIcon className="h-7 w-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
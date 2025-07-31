import React from 'react';
import { HomeIcon, MagnifyingGlassIcon, TruckIcon, BoltIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { TabType } from '../types/index';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'explore', name: 'Explore', icon: MagnifyingGlassIcon },
    { id: 'cruze', name: 'Cruze', icon: TruckIcon },
    { id: 'live', name: 'Live Now', icon: BoltIcon },
    { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              {tab.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation; 
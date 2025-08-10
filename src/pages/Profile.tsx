import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../lib/store';
import { Post } from '../types/index';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog6ToothIcon, 
  ShareIcon, 
  StarIcon,
  HeartIcon,
  TagIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  MinusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { SavedEmptyIcon, SellingEmptyIcon, BuyingEmptyIcon } from '../components/SVGIcon';

const Profile: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { savedPosts } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'saved' | 'selling' | 'buying'>('saved');
  const [showSettings, setShowSettings] = useState(false);

  // Mock data for selling and buying
  const sellingItems: Post[] = [
    {
      id: '1',
      user_id: currentUser?.id || '',
      type: 'item',
      title: 'iPhone 13 Pro',
      description: 'Perfect condition, comes with original box',
      price: 750,
      category: 'Electronics',
      location: 'Purdue Campus',
      created_at: new Date().toISOString(),
      status: 'active',
      tags: ['electronics', 'phone'],
    },
    {
      id: '2',
      user_id: currentUser?.id || '',
      type: 'item',
      title: 'Calculus Textbook',
      description: 'Used but in good condition',
      price: 45,
      category: 'Books',
      location: 'Purdue Campus',
      created_at: new Date().toISOString(),
      status: 'active',
      tags: ['books', 'textbook'],
    }
  ];

  const buyingOffers = [
    {
      id: '1',
      title: 'MacBook Pro 2021',
      price: 1200,
      status: 'pending' as 'pending' | 'accepted' | 'declined',
      seller: 'John Doe',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Bike for commuting',
      price: 150,
      status: 'accepted' as 'pending' | 'accepted' | 'declined',
      seller: 'Jane Smith',
      created_at: new Date().toISOString(),
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleCreatePost = () => {
    navigate('/post');
  };

  const handleFindDeals = () => {
    navigate('/live');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-[#06D6A0] text-white';
      case 'pending':
        return 'bg-[#FFD166] text-[#0E1F33]';
      case 'declined':
        return 'bg-gray-300 text-gray-600';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'declined':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero Header */}
      <div className="bg-[#0E1F33] text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-lg font-bold">{currentUser?.name || 'User'}</h2>
              <span className="px-2 py-1 bg-[#06D6A0] text-[#0E1F33] text-xs font-semibold rounded-full">
                Verified
              </span>
            </div>
            <p className="text-sm text-[#D8E1EE]">{currentUser?.university || 'University'}</p>
            <button className="flex items-center space-x-1 text-[#FFD166] text-sm font-medium mt-1">
              <ShareIcon className="h-4 w-4" />
              <span>Share profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-white px-4 py-3 border-b border-[#E6E9EE]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-1 bg-[#06D6A0] text-[#0E1F33] text-xs font-semibold rounded-full">
                Trusted Seller
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#06D6A0] h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-left">Complete phone verification to unlock full benefits</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white px-4 py-4 border-b border-[#E6E9EE]">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <StarIcon className="h-4 w-4 text-[#FFD166]" />
              <span className="text-lg font-bold text-[#0E1F33]">4.8</span>
            </div>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#0E1F33] mb-1">24</div>
            <p className="text-xs text-gray-600">Sales</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#0E1F33] mb-1">98%</div>
            <p className="text-xs text-gray-600">Reply rate</p>
            <p className="text-xs text-gray-500">Avg reply 12m</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 border-b border-[#E6E9EE]">
        <div className="flex space-x-1">
          {[
            { key: 'saved', label: 'Saved', count: savedPosts.length, icon: HeartIcon },
            { key: 'selling', label: 'Selling', count: sellingItems.length, icon: TagIcon },
            { key: 'buying', label: 'Buying', count: buyingOffers.length, icon: ShoppingBagIcon }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#FFEEE6] text-[#FF6B35]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label} ({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === 'saved' && (
          <div>
            {savedPosts.length > 0 ? (
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#F5F7FA] rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#0E1F33]">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0E1F33]">{post.title}</h3>
                        <p className="text-sm text-gray-600">{post.location}</p>
                        <p className="text-lg font-bold text-[#FF6B35]">
                          {post.price ? `$${post.price}` : 'Free'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SavedEmptyIcon className="h-24 w-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0E1F33] mb-2">Nothing saved yet 👀</h3>
                <p className="text-gray-600 mb-6">Start saving items you love to find them later</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleFindDeals}
                    className="w-full h-11 bg-[#FF6B35] text-white rounded-xl font-semibold hover:brightness-110 transition-colors"
                  >
                    Find deals
                  </button>
                  <button 
                    onClick={handleCreatePost}
                    className="w-full h-11 border border-[#E6E9EE] text-[#0E1F33] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Post something
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'selling' && (
          <div>
            {sellingItems.length > 0 ? (
              <div className="space-y-4">
                {sellingItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 bg-[#F5F7FA] rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#0E1F33]">
                          {item.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0E1F33]">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        <p className="text-lg font-bold text-[#FF6B35]">
                          ${item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">12 watching</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-[#F5F7FA] text-[#0E1F33] rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        <ArrowUpIcon className="h-4 w-4" />
                        <span>Bump</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-[#F5F7FA] text-[#0E1F33] rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        <MinusIcon className="h-4 w-4" />
                        <span>−10%</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-colors">
                        <CheckIcon className="h-4 w-4" />
                        <span>Mark sold</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SellingEmptyIcon className="h-24 w-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0E1F33] mb-2">No items for sale</h3>
                <p className="text-gray-600 mb-6">Start selling to earn money and declutter your space</p>
                <button 
                  onClick={handleCreatePost}
                  className="w-full h-11 bg-[#FF6B35] text-white rounded-xl font-semibold hover:brightness-110 transition-colors"
                >
                  Post something
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'buying' && (
          <div>
            {buyingOffers.length > 0 ? (
              <div className="space-y-4">
                {buyingOffers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#0E1F33]">{offer.title}</h3>
                        <p className="text-sm text-gray-600">from {offer.seller}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                        {getStatusText(offer.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#FF6B35]">${offer.price}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(offer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BuyingEmptyIcon className="h-24 w-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0E1F33] mb-2">No purchase history</h3>
                <p className="text-gray-600 mb-6">Your completed purchases will appear here</p>
                <button 
                  onClick={handleFindDeals}
                  className="w-full h-11 bg-[#FF6B35] text-white rounded-xl font-semibold hover:brightness-110 transition-colors"
                >
                  Browse deals
                </button>
              </div>
            )}
          </div>
        )}
      </div>

             {/* Settings Modal */}
       <AnimatePresence>
         {showSettings && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 pb-20"
           >
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ 
                 type: "spring", 
                 damping: 25, 
                 stiffness: 300,
                 duration: 0.4
               }}
               className="bg-white rounded-t-xl w-full max-w-md flex flex-col" 
               style={{ maxHeight: '70vh' }}
             >
             <div className="p-4 border-b border-[#E6E9EE] flex-shrink-0">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-[#0E1F33]">Settings</h3>
                 <button
                   onClick={() => setShowSettings(false)}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <span className="text-2xl">×</span>
                 </button>
               </div>
             </div>
             
                                          <div className="flex-1 overflow-y-auto">
                 <motion.div 
                   className="p-4 space-y-4"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.1, duration: 0.3 }}
                 >
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                     <p className="font-medium text-[#0E1F33]">Verify phone number</p>
                     <p className="text-sm text-gray-600">Add phone for better security</p>
                   </motion.button>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                     <p className="font-medium text-[#0E1F33]">Verify email</p>
                     <p className="text-sm text-gray-600">Confirm your email address</p>
                   </motion.button>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                     <p className="font-medium text-[#0E1F33]">Report an issue</p>
                     <p className="text-sm text-gray-600">Help us improve the app!</p>
                   </motion.button>
                   
                   {/* Sign out option - styled like other settings but with subtle distinction */}
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleSignOut}
                     className="w-full text-left py-3 px-4 hover:bg-red-50 rounded-lg transition-colors border-l-4 border-l-transparent hover:border-l-red-200"
                   >
                     <p className="font-medium text-red-600">Sign out</p>
                     <p className="text-sm text-red-500">End your current session</p>
                   </motion.button>
                 </motion.div>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default Profile;



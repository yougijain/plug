import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useAppStore } from '../lib/store';
import { Post } from '../types/index';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  HeartIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { EmptyStateIcon, LogoIcon } from '../components/SVGIcon';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { posts, isLoading } = usePosts();
  const { addToCart, toggleSavedPost } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [hasNotifications, setHasNotifications] = useState(true); // Mock - wire to real notifications

  // Test Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('posts')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('❌ Supabase connection failed:', error);
        } else {
          console.log('✅ Supabase connected successfully');
        }
      } catch (err) {
        console.error('❌ Failed to test Supabase connection:', err);
      }
    };
    
    testConnection();
  }, []);

  const handleSavePost = (post: Post) => {
    toggleSavedPost(post);
    addToCart(post);
  };

  const handlePostClick = (post: Post) => {
    // Navigate to post detail or open modal
    console.log('Post clicked:', post.id);
  };

  const handleCreatePost = () => {
    navigate('/post');
  };

  const handleLiveNow = () => {
    navigate('/live');
  };

  const handleCart = () => {
    navigate('/saved');
  };

  const handleNotifications = () => {
    // Handle notifications - wire to real notification system
    console.log('Notifications clicked');
    setHasNotifications(false); // Clear badge on tap
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All Categories', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Services'];

  return (
         <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-[#0E1F33] text-white h-16 relative">
        {/* Subtle inner highlight line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white opacity-[0.08]"></div>
        
        <div className="flex items-center justify-between h-full px-4">
          {/* Left side - Logo and wordmark */}
          <div className="flex items-center space-x-2">
            {/* Brand plate behind logo */}
            <div className="relative">
              <div className="absolute inset-0 w-6 h-6 bg-white rounded-full opacity-[0.14]"></div>
              <div className="relative">
                <LogoIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white leading-none">Plug</h1>
              <span className="text-xs font-medium text-[#D0D6E1] leading-none">Plug into campus life.</span>
            </div>
          </div>
          
          {/* Right side - Icons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCart}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Saved items"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button 
              onClick={handleNotifications}
              className="relative p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              {/* Badge: 12px circle, positioned in top-right corner */}
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#FF6B35] text-white text-[8px] leading-none flex items-center justify-center font-semibold">
                  1
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Row */}
      <div className="px-4 py-4 bg-white border-b border-[#E6E9EE]">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search everything on campus…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-[#E6E9EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'All Categories' ? 'Electronics' : 'All Categories')}
            className="h-10 px-4 bg-white border border-[#E6E9EE] rounded-xl text-sm font-medium text-[#0E1F33] flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>{selectedCategory}</span>
          </button>
        </div>
      </div>

             {/* Content */}
       <div className="px-4 py-6">
                 {/* Plug of the Day - Single Card */}
         <div className="mb-8">
           <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#ECECEC]">
             <div className="h-7 bg-[#FFB400] flex items-center justify-center">
               <span className="text-sm font-semibold text-[#0E1F33]">🔥 Plug of the Day</span>
             </div>
             <div className="p-4">
               <h3 className="text-lg font-bold text-[#0E1F33] mb-2">iPhone 13 Pro - Like New</h3>
               <p className="text-gray-600 text-sm mb-3">Perfect condition, comes with original box and charger. Need to sell before graduation!</p>
               <div className="flex items-center justify-between">
                 <span className="text-3xl font-bold text-[#FF6B35]">$750</span>
                 <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-semibold hover:brightness-110 transition-colors">
                   View Details
                 </button>
               </div>
             </div>
           </div>
         </div>

        {/* Feed */}
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-4">
            {/* Plug of the Day skeleton */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-7 bg-[#FFD166]"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
                         {/* 3 post skeletons */}
             {[...Array(3)].map((_, i) => (
               <div key={i} className="bg-white rounded-xl p-4 shadow-lg animate-pulse border border-[#ECECEC]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          // Posts feed
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPosts.map((post, index) => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow border border-[#ECECEC]"
                onClick={() => handlePostClick(post)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#0E1F33]">
                      {post.users?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0E1F33]">{post.users?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{post.location}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePost(post);
                    }}
                    className="p-2 text-gray-400 hover:text-[#FF6B35] transition-colors"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-[#0E1F33] mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#FF6B35]">
                    {post.price ? `$${post.price}` : 'Free'}
                  </span>
                  <div className="flex space-x-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tag.toLowerCase() === 'free' 
                            ? 'bg-[#06D6A0] text-white' 
                            : 'bg-[#F5F7FA] text-[#0E1F33]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
                     // Empty state
           <div className="text-center py-16">
             <div className="mb-8">
               <EmptyStateIcon className="w-12 h-12 mx-auto mb-6 opacity-80" />
               <h3 className="text-base font-bold text-[#2B2B2B] mb-3">No posts yet</h3>
               <p className="text-sm font-medium text-[#6F7A85] mb-8">Be the first to share something with your campus!</p>
             </div>
             <motion.div 
               className="space-y-4"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 0.4 }}
             >
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleCreatePost}
                 className="w-full h-11 bg-[#FF6B35] text-white rounded-lg font-semibold hover:brightness-110 transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.08)]"
               >
                 Post Something
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleLiveNow}
                 className="text-[#FF6B35] text-sm font-medium hover:underline"
               >
                 See what's Live →
               </motion.button>
             </motion.div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Home; 
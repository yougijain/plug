import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useAppStore } from '../lib/store';
import { Post } from '../types/index';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  HeartIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-[#0E1F33] text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Plug</h1>
            <p className="text-sm text-[#D8E1EE]">Your Campus, Connected.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCart}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Saved items"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button 
              onClick={handleNotifications}
              className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              {/* Only show badge if there are real notifications */}
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#FF6B35] text-white text-[10px] leading-3 flex items-center justify-center font-semibold">
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
      <div className="px-4 py-4">
        {/* Plug of the Day - Single Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-7 bg-[#FFD166] flex items-center justify-center">
              <span className="text-sm font-semibold text-[#0E1F33]">🔥 Plug of the Day</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#0E1F33] mb-2">iPhone 13 Pro - Like New</h3>
              <p className="text-gray-600 text-sm mb-3">Perfect condition, comes with original box and charger. Need to sell before graduation!</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#FF6B35]">$750</span>
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
              <div key={i} className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
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
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <PlusIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#0E1F33] mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share something with your campus!</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCreatePost}
                className="w-full h-11 bg-[#FF6B35] text-white rounded-[22px] font-semibold hover:brightness-110 transition-colors"
              >
                Post Something
              </button>
              <button
                onClick={handleLiveNow}
                className="text-[#FF6B35] font-medium hover:underline"
              >
                See what's Live →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 
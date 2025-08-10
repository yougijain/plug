import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Post } from '../types/index';
import { useAppStore } from '../lib/store';
import { formatDistanceToNow } from 'date-fns';
import { 
  BoltIcon, 
  FireIcon, 
  ClockIcon, 
  EyeIcon
} from '@heroicons/react/24/outline';

interface LiveNowProps {
  currentUser: User;
}

const LiveNow: React.FC<LiveNowProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const { savePost, addToCart } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ending-soon' | 'newest' | 'price-drops'>('ending-soon');

  // Mock data for MVP - simulating real-time updates
  const mockPosts = useMemo<Post[]>(() => [
    {
      id: '1',
      user_id: 'user1',
      type: 'item',
      title: 'FREE Pizza - Domino\'s Flash Deal!',
      description: 'Next 5 pizzas sold at Domino\'s will be $5 only! Limited time offer.',
      price: 5,
      category: 'Food',
      location: 'Purdue Campus',
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      status: 'active',
      tags: ['pizza', 'food', 'flash-deal'],
      is_flash_deal: true,
      flash_deal_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    },
    {
      id: '2',
      user_id: 'user2',
      type: 'service',
      title: 'Last-minute haircut needed!',
      description: 'Need a haircut for an interview tomorrow. Will pay extra for quick service.',
      price: 30,
      category: 'Services',
      location: 'Indiana University Campus',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      status: 'active',
      tags: ['haircut', 'urgent', 'service'],
    },
    {
      id: '3',
      user_id: 'user3',
      type: 'ride',
      title: 'URGENT: Ride to airport needed',
      description: 'Flight leaves in 2 hours. Will pay $50 for immediate ride to IND airport.',
      price: 50,
      category: 'Transportation',
      location: 'Purdue to IND Airport',
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      status: 'active',
      tags: ['urgent', 'airport', 'ride'],
    },
    {
      id: '4',
      user_id: 'user4',
      type: 'item',
      title: 'Selling textbooks - Finals week special',
      description: 'All engineering textbooks 50% off. Need to sell before graduation.',
      price: 25,
      category: 'Books',
      location: 'Indiana University Campus',
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
      status: 'active',
      tags: ['textbooks', 'engineering', 'graduation'],
    },
  ], []);

  useEffect(() => {
    setPosts(mockPosts);
  }, [mockPosts]);

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        // Add a new random post occasionally
        if (Math.random() > 0.7) {
          const newPost: Post = {
            id: Date.now().toString(),
            user_id: 'user' + Math.floor(Math.random() * 10),
            type: 'item',
            title: 'New post just added!',
            description: 'This is a simulated real-time post.',
            price: Math.floor(Math.random() * 50) + 10,
            category: 'General',
            location: Math.random() > 0.5 ? 'Purdue Campus' : 'Indiana University Campus',
            created_at: new Date().toISOString(),
            status: 'active',
            tags: ['new', 'real-time'],
          };
          setPosts(prev => [newPost, ...prev.slice(0, 9)]); // Keep only 10 posts
        }
        setIsRefreshing(false);
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleContact = (postId: string) => {
    navigate('/messages');
  };

  const handleSave = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (target) {
      savePost(target);
      addToCart(target);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getProgressPercentage = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const total = 30 * 60 * 1000; // 30 minutes in ms
    return Math.max(0, Math.min(100, ((total - diff) / total) * 100));
  };

  const isUrgent = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    return diff <= 5 * 60 * 1000; // 5 minutes or less
  };

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    
    switch (selectedFilter) {
      case 'ending-soon':
        filtered = filtered.filter(post => post.is_flash_deal);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-drops':
        filtered = filtered.filter(post => post.price && post.price < 50);
        break;
    }
    
    return filtered;
  }, [posts, selectedFilter]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E9EE] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BoltIcon className="h-6 w-6 text-[#FF6B35]" />
            <div>
              <h1 className="text-xl font-bold text-[#0E1F33]">Live Now</h1>
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06D6A0]"></span>
                </span>
                <p className="text-sm text-gray-500">Live feed • updates every 30s</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full transition-colors ${
              isRefreshing ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BoltIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 bg-white border-b border-[#E6E9EE]">
        <div className="flex space-x-2">
          {[
            { key: 'ending-soon', label: 'Ending Soon' },
            { key: 'newest', label: 'Newest' },
            { key: 'price-drops', label: 'Price Drops' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-[#E6E9EE] text-[#0E1F33] hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg border border-[#E6E9EE] overflow-hidden">
              {/* Countdown Band */}
              {post.is_flash_deal && post.flash_deal_expires_at && (
                <div className={`px-4 py-2 flex items-center justify-between text-sm font-semibold ${
                  isUrgent(post.flash_deal_expires_at) 
                    ? 'bg-[#FF6B35] text-white animate-pulse' 
                    : 'bg-[#FFD166] text-[#0E1F33]'
                }`}>
                  <div className="flex items-center space-x-2">
                    <FireIcon className="h-4 w-4" />
                    <span>Ends in {getTimeRemaining(post.flash_deal_expires_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🔥 Flash Deal</span>
                  </div>
                </div>
              )}
              
              {/* Progress Bar for Flash Deals */}
              {post.is_flash_deal && post.flash_deal_expires_at && (
                <div className="h-1 bg-gray-200">
                  <div 
                    className="h-1 bg-[#FF6B35] transition-all duration-1000"
                    style={{ width: `${getProgressPercentage(post.flash_deal_expires_at)}%` }}
                  ></div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0E1F33] text-lg mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.description}</p>
                  </div>
                  {post.price && (
                    <span className="text-xl font-bold text-[#FF6B35] ml-2">
                      ${post.price}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{post.location}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <EyeIcon className="h-4 w-4" />
                      <span>12 watching</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tag.toLowerCase() === 'free'
                          ? 'bg-[#06D6A0] text-white'
                          : tag.includes('urgent') || tag.includes('flash-deal')
                          ? 'bg-[#FFD166] text-[#0E1F33]'
                          : 'bg-[#F5F7FA] text-[#0E1F33]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#F5F7FA] text-[#0E1F33]">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleContact(post.id)}
                    className="flex-1 bg-[#FF6B35] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:brightness-110 transition-colors"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className="flex-1 border border-[#E6E9EE] text-[#0E1F33] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#FFEEE6] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BoltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No live deals at the moment</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon for new flash deals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveNow; 
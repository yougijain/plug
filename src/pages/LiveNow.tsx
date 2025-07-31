import React, { useState, useEffect } from 'react';
import { User, Post } from '../types/index';
import { formatDistanceToNow } from 'date-fns';
import { BoltIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline';

interface LiveNowProps {
  currentUser: User;
}

const LiveNow: React.FC<LiveNowProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for MVP - simulating real-time updates
  const mockPosts: Post[] = [
    {
      id: '1',
      userId: 'user1',
      type: 'item',
      title: 'FREE Pizza - Domino\'s Flash Deal!',
      description: 'Next 5 pizzas sold at Domino\'s will be $5 only! Limited time offer.',
      price: 5,
      category: 'Food',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      status: 'active',
      tags: ['pizza', 'food', 'flash-deal'],
      isFlashDeal: true,
      flashDealExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    },
    {
      id: '2',
      userId: 'user2',
      type: 'service',
      title: 'Last-minute haircut needed!',
      description: 'Need a haircut for an interview tomorrow. Will pay extra for quick service.',
      price: 30,
      category: 'Services',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'active',
      tags: ['haircut', 'urgent', 'service'],
    },
    {
      id: '3',
      userId: 'user3',
      type: 'ride',
      title: 'URGENT: Ride to airport needed',
      description: 'Flight leaves in 2 hours. Will pay $50 for immediate ride to IND airport.',
      price: 50,
      category: 'Transportation',
      location: 'Purdue to IND Airport',
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      status: 'active',
      tags: ['urgent', 'airport', 'ride'],
    },
    {
      id: '4',
      userId: 'user4',
      type: 'item',
      title: 'Selling textbooks - Finals week special',
      description: 'All engineering textbooks 50% off. Need to sell before graduation.',
      price: 25,
      category: 'Books',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      status: 'active',
      tags: ['textbooks', 'engineering', 'graduation'],
    },
  ];

  useEffect(() => {
    setPosts(mockPosts);
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        // Add a new random post occasionally
        if (Math.random() > 0.7) {
          const newPost: Post = {
            id: Date.now().toString(),
            userId: 'user' + Math.floor(Math.random() * 10),
            type: 'item',
            title: 'New post just added!',
            description: 'This is a simulated real-time post.',
            price: Math.floor(Math.random() * 50) + 10,
            category: 'General',
            location: 'Purdue Campus',
            createdAt: new Date(),
            status: 'active',
            tags: ['new', 'real-time'],
          };
          setPosts(prev => [newPost, ...prev.slice(0, 9)]); // Keep only 10 posts
        }
        setIsRefreshing(false);
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, [mockPosts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleContact = (postId: string) => {
    alert(`Contacting seller for post ${postId}`);
  };

  const handleSave = (postId: string) => {
    alert(`Saved post ${postId}`);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BoltIcon className="h-6 w-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Now</h1>
              <p className="text-sm text-gray-500">Real-time campus activity</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full transition-colors ${
              isRefreshing ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BoltIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="px-4 py-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Activity</h2>
          <p className="text-sm text-gray-500">What's happening right now on campus</p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 relative">
              {post.isFlashDeal && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  <FireIcon className="h-3 w-3" />
                  <span>Flash Deal</span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.description}</p>
                </div>
                {post.price && (
                  <span className="text-lg font-bold text-primary-600 ml-2">
                    ${post.price}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{post.location}</span>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
              
              {post.isFlashDeal && post.flashDealExpiresAt && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600 font-medium">Flash Deal Expires</span>
                    <span className="text-red-500">
                      {formatDistanceToNow(post.flashDealExpiresAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-full text-xs ${
                      tag.includes('urgent') || tag.includes('flash-deal')
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
                             <div className="flex space-x-2 mt-3">
                 <button 
                   onClick={() => handleContact(post.id)}
                   className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                 >
                   Contact
                 </button>
                 <button 
                   onClick={() => handleSave(post.id)}
                   className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                 >
                   Save
                 </button>
               </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-8">
            <BoltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No live activity at the moment.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveNow; 
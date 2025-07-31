import React, { useState } from 'react';
import { User, Post } from '../types/index';
import { formatDistanceToNow } from 'date-fns';
import { PlusIcon, StarIcon } from '@heroicons/react/24/outline';

interface HomeProps {
  currentUser: User;
}

const Home: React.FC<HomeProps> = ({ currentUser }) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([
    {
      id: '2',
      userId: 'user2',
      type: 'item',
      title: 'MacBook Pro 2021',
      description: 'Excellent condition, 16GB RAM, 512GB SSD. Graduating and need to sell.',
      price: 1200,
      category: 'Electronics',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'active',
      tags: ['laptop', 'macbook', 'electronics'],
    },
    {
      id: '3',
      userId: 'user3',
      type: 'ride',
      title: 'Ride to Indianapolis Airport',
      description: 'Leaving tomorrow at 2 PM. 2 seats available. $15 per person.',
      price: 15,
      category: 'Transportation',
      location: 'Purdue to IND Airport',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'active',
      tags: ['airport', 'transportation', 'ride'],
    },
  ]);

  // Mock data for MVP
  const plugOfTheDay: Post = {
    id: '1',
    userId: 'user1',
    type: 'service',
    title: 'Expert Math Tutoring',
    description: 'Calculus, Linear Algebra, Statistics. 4.9/5 rating. Available evenings and weekends.',
    price: 25,
    category: 'Tutoring',
    location: 'Purdue Campus',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'active',
    tags: ['tutoring', 'math', 'calculus'],
    isFlashDeal: true,
    flashDealExpiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
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
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-sm text-gray-500">{currentUser.university}</p>
          </div>
          <button className="bg-primary-600 text-white p-2 rounded-full">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Plug of the Day */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">🔥 Plug of the Day</h2>
            <StarIcon className="h-5 w-5" />
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold text-lg">{plugOfTheDay.title}</h3>
            <p className="text-sm opacity-90 mb-2">{plugOfTheDay.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">${plugOfTheDay.price}/hr</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                Flash Deal - 6h left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.description}</p>
                </div>
                {post.price && (
                  <span className="text-lg font-bold text-primary-600">${post.price}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{post.location}</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
                             <div className="flex flex-wrap gap-1 mt-2">
                 {post.tags.slice(0, 3).map((tag) => (
                   <span
                     key={tag}
                     className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
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
       </div>
     </div>
   );
 };

export default Home; 
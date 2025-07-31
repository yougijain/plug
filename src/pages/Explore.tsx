import React, { useState, useEffect } from 'react';
import { User, Post } from '../types/index';
import { formatDistanceToNow } from 'date-fns';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ExploreProps {
  currentUser: User;
}

const Explore: React.FC<ExploreProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const categories = [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'services', name: 'Services', icon: '🔧' },
    { id: 'tickets', name: 'Tickets', icon: '🎫' },
  ];

  // Mock data for MVP
  const allPosts: Post[] = [
    {
      id: '1',
      userId: 'user1',
      type: 'item',
      title: 'iPhone 13 Pro',
      description: 'Perfect condition, 128GB, comes with case and charger.',
      price: 800,
      category: 'Electronics',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      tags: ['iphone', 'electronics', 'phone'],
    },
    {
      id: '2',
      userId: 'user2',
      type: 'item',
      title: 'Calculus Textbook',
      description: 'Calculus: Early Transcendentals, 8th Edition. Like new.',
      price: 45,
      category: 'Books',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'active',
      tags: ['textbook', 'calculus', 'math'],
    },
    {
      id: '3',
      userId: 'user3',
      type: 'service',
      title: 'Haircut Services',
      description: 'Professional haircuts for men and women. $15-25 depending on style.',
      price: 20,
      category: 'Services',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active',
      tags: ['haircut', 'beauty', 'service'],
    },
    {
      id: '4',
      userId: 'user4',
      type: 'ticket',
      title: 'Purdue Basketball Tickets',
      description: '2 tickets for Purdue vs IU game. Section 15, Row 8.',
      price: 75,
      category: 'Tickets',
      location: 'Purdue Campus',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active',
      tags: ['basketball', 'tickets', 'purdue'],
    },
  ];

  useEffect(() => {
    const filtered = allPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             post.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory]);

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
        <h1 className="text-xl font-bold text-gray-900">Explore</h1>
        <p className="text-sm text-gray-500">Find what you need on campus</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items, services, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'item' : 'items'} found
          </h2>
          <button className="flex items-center space-x-1 text-sm text-gray-500">
            <FunnelIcon className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
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

         {filteredPosts.length === 0 && (
           <div className="text-center py-8">
             <p className="text-gray-500">No items found matching your search.</p>
           </div>
         )}
       </div>
     </div>
   );
 };

export default Explore; 
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { posts, isLoading, error, createPost, isCreatingPost } = usePosts();
  // Category filter UI placeholder; full filter sheet can be added later
  const [selectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'item' as 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet',
    location: '',
  });

  // Post modal replaced by FAB flow

  const handleTestDatabase = async () => {
    console.log('🔍 [Home] Testing database connection...');
    try {
      // Import supabase client
      const { supabase } = await import('../lib/supabase');
      
      // Test connection by selecting a simple column
      const { error } = await supabase.from('posts').select('id').limit(1);
      
      if (error) {
        console.error('❌ Database test failed:', error);
        alert(`Database test failed: ${error.message}`);
      } else {
        console.log('✅ Database test successful');
        alert('Database connection successful!');
      }
         } catch (err) {
       console.error('❌ Test failed:', err);
       alert(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
     }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      title: '',
      description: '',
      price: '',
      category: '',
      type: 'item',
      location: '',
    });
  };

    const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 [Home] Submit post started');
    console.log('🔍 [Home] Current user:', currentUser);
    console.log('🔍 [Home] Form data:', createForm);
    
    if (!currentUser?.id) {
      console.error('❌ [Home] No current user ID');
      alert('You must be logged in to create a post');
      return;
    }

    // Validate required fields
    if (!createForm.title.trim()) {
      alert('Please enter a title for your post');
      return;
    }

    if (!createForm.description.trim()) {
      alert('Please enter a description for your post');
      return;
    }

    if (!createForm.category) {
      alert('Please select a category');
      return;
    }

    if (!createForm.location.trim()) {
      alert('Please enter a location');
      return;
    }

    try {
      const postData = {
        user_id: currentUser.id,
        type: createForm.type,
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        price: createForm.price ? parseFloat(createForm.price) : undefined,
        category: createForm.category,
        location: createForm.location.trim(),
        images: [],
        status: 'active' as const,
        tags: [],
      };

      console.log('🔍 [Home] Creating post with data:', postData);
      
      // Use mutateAsync to wait for the mutation to complete
      const result = await createPost(postData);
      
      console.log('✅ [Home] Post created successfully:', result);
      
      // Show success message
      alert('Post created successfully! Your post is now live.');
      
      // Close modal and reset form
      handleCloseModal();
      
    } catch (error) {
      console.error('❌ [Home] Failed to create post:', error);
      console.error('❌ [Home] Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to create post';
      if (error instanceof Error) {
        console.error('❌ [Home] Error message:', error.message);
        console.error('❌ [Home] Error stack:', error.stack);
        
        if (error.message.includes('duplicate')) {
          errorMessage = 'A similar post already exists';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your post details and try again';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again';
        } else if (error.message.includes('auth')) {
          errorMessage = 'Authentication error. Please sign in again.';
        } else {
          errorMessage = error.message;
        }
      } else {
        console.error('❌ [Home] Non-Error object:', typeof error, error);
        errorMessage = `Unknown error: ${JSON.stringify(error)}`;
      }
      
      alert(`Failed to create post: ${errorMessage}`);
    }
  };



  const filteredPosts = (posts || []).filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });



  // const categories = ['all', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

  return (
    <div className="pb-20 bg-brandOffWhite">
      {/* Header */}
      <div className="bg-brandNavy" style={{ height: 64 }}>
        <div className="h-full flex items-center justify-between px-4">
          <div>
            <h1 className="text-[18px] font-bold text-white leading-tight">Plug</h1>
            <p className="text-[12px] font-semibold text-[#D8E1EE]">Your Campus, Connected.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications with badge */}
            <button
              onClick={handleTestDatabase}
              className="relative text-white/90 hover:text-white"
              title="Notifications"
              aria-label="Notifications"
            >
              🔔
              <span className="absolute -top-1 -right-2 h-3.5 w-3.5 rounded-full bg-brandOrange text-white text-[10px] leading-3 flex items-center justify-center font-semibold">1</span>
            </button>
            {/* Optional heart icon access */}
            {/* <button onClick={() => (window.location.href = '/saved')} className="text-white/90 hover:text-white" aria-label="Saved">♥</button> */}
          </div>
        </div>
      </div>

      {/* Plug of the Day first */}
      <div className="px-4 mt-4">
        <div className="rounded-xl shadow-md bg-white border border-neutral-200">
          <div className="bg-brandYellow h-7 rounded-t-xl flex items-center px-2">
            <span className="text-brandNavy font-semibold text-[14px]">🔥 Plug of the Day</span>
          </div>
          {/* Optional image area */}
          <div className="w-full aspect-video bg-brandOffWhite" />
          <div className="p-4">
            <p className="text-[14px] leading-relaxed text-dark-600">Today’s top campus deal handpicked for you.</p>
          </div>
        </div>
      </div>

      {/* Search and Filter under Plug */}
      <div className="px-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search everything on campus…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 border border-[#E6E9EE] rounded-xl focus:ring-1 focus:ring-brandOrange focus:border-brandOrange text-[14px]"
            />
          </div>
          <button className="flex items-center space-x-2 h-10 px-3 rounded-xl bg-white text-brandNavy text-[14px] font-semibold border border-[#E6E9EE]">
            <FunnelIcon className="h-5 w-5" />
            <span>All Categories</span>
          </button>
        </div>
      </div>

      {/* Plug of the Day */}
      <div className="px-4 mt-4">
        <div className="rounded-xl shadow-md bg-white border border-neutral-200">
          <div className="bg-brandYellow h-7 rounded-t-xl flex items-center px-2">
            <span className="text-brandNavy font-semibold text-[14px]">🔥 Plug of the Day</span>
          </div>
          <div className="p-4">
            <p className="text-[14px] leading-relaxed text-dark-600">Today’s top campus deal handpicked for you.</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-600">Error: {error?.message || 'Unknown error'}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10">
            {/* Simple placeholder illustration substitute */}
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-brandOffWhite border border-neutral-300 flex items-center justify-center">📱</div>
            <p className="text-[18px] font-semibold text-brandNavy">Be the first to post 📸</p>
            <p className="text-[14px] text-dark-500 max-w-[240px] mx-auto mt-1">Your deal could be today’s Plug of the Day!</p>
            <button onClick={() => (window.location.href = '/post')} className="mt-4 inline-flex items-center rounded-full bg-brandOrange text-white px-5 py-2 text-[14px] font-semibold">Post Something</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {post.type}
                      </span>
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-dark-900 mb-2">{post.title}</h3>
                    <p className="text-dark-600 text-sm mb-3">{post.description}</p>
                                         <div className="flex items-center justify-between text-sm">
                       <span className="text-dark-500">{post.location}</span>
                                               {post.price && (
                          <span className="font-semibold text-orange-600">${typeof post.price === 'string' ? parseFloat(post.price).toFixed(2) : post.price.toFixed(2)}</span>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-dark-900">Create New Post</h2>
              <button
                onClick={handleCloseModal}
                className="text-dark-400 hover:text-dark-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Post Type
                </label>
                <select
                  value={createForm.type}
                  onChange={(e) => setCreateForm({...createForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="item">Item</option>
                  <option value="service">Service</option>
                  <option value="ride">Ride</option>
                  <option value="ticket">Ticket</option>
                  <option value="book">Book</option>
                  <option value="sublet">Sublet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What are you selling?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your item or service..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                                 <div>
                   <label className="block text-sm font-medium text-dark-700 mb-1">
                     Price
                   </label>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500">$</span>
                     <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={createForm.price}
                       onChange={(e) => {
                         const value = e.target.value;
                         setCreateForm({...createForm, price: value});
                       }}
                       onBlur={(e) => {
                         const value = e.target.value;
                         if (value && !isNaN(parseFloat(value))) {
                           const formattedValue = parseFloat(value).toFixed(2);
                           setCreateForm({...createForm, price: formattedValue});
                         }
                       }}
                       className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="0.00"
                     />
                   </div>
                 </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where can people find this?"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isCreatingPost}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-dark-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingPost || !createForm.title || !createForm.description || !createForm.category || !createForm.location}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCreatingPost ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 
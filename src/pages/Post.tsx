import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { 
  ChevronLeftIcon, 
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Post: React.FC = () => {
  const { currentUser } = useAuth();
  const { createPost, isCreatingPost } = usePosts();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    type: 'item' as 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet',
    category: '',
    images: [] as string[],
    title: '',
    description: '',
    price: '',
    location: '',
    is_flash_deal: false,
  });

  const next = () => setStep((s) => (s === 3 ? s : ((s + 1) as any)));
  const back = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep((s) => (s === 1 ? s : ((s - 1) as any)));
    }
  };

  const submit = async () => {
    if (!currentUser?.id) return;
    try {
      await createPost({
        user_id: currentUser.id,
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : undefined,
        category: form.category,
        location: form.location,
        images: form.images,
        status: 'active',
        tags: [],
        is_flash_deal: form.is_flash_deal,
        flash_deal_expires_at: undefined,
        expires_at: undefined,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E9EE] px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <button 
              onClick={back} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Back"
            >
              <ChevronLeftIcon className="h-6 w-6 text-[#0E1F33]" />
            </button>
          </div>
          <h1 className="justify-self-center text-lg font-bold text-[#0E1F33]">Create Post</h1>
          <div className="justify-self-end w-10" />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white px-4 py-3 border-b border-[#E6E9EE]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 1 ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className={`text-sm ${step >= 1 ? 'text-[#0E1F33]' : 'text-gray-400'}`}>Category</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4" />
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 2 ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`text-sm ${step >= 2 ? 'text-[#0E1F33]' : 'text-gray-400'}`}>Photos</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4" />
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= 3 ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className={`text-sm ${step >= 3 ? 'text-[#0E1F33]' : 'text-gray-400'}`}>Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0E1F33] mb-2">What are you posting?</h2>
              <p className="text-gray-600">Choose the category that best fits your item</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'Electronics', icon: '📱' },
                { value: 'Books', icon: '📚' },
                { value: 'Furniture', icon: '🪑' },
                { value: 'Clothing', icon: '👕' },
                { value: 'Sports', icon: '⚽' },
                { value: 'Other', icon: '📦' }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setForm({ ...form, category: category.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    form.category === category.value
                      ? 'border-[#FF6B35] bg-[#FFEEE6]'
                      : 'border-[#E6E9EE] bg-white hover:border-[#FF6B35]/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-[#0E1F33]">{category.value}</div>
                </button>
              ))}
            </div>

            <button 
              onClick={next} 
              disabled={!form.category} 
              className={`w-full h-12 rounded-xl font-semibold transition-colors ${
                form.category 
                  ? 'bg-[#FF6B35] text-white hover:brightness-110' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0E1F33] mb-2">Add Photos</h2>
              <p className="text-gray-600">Photos help buyers see what they're getting</p>
            </div>
            
            <div className="bg-white border-2 border-dashed border-[#E6E9EE] rounded-xl p-8 text-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Tap to add photos</p>
              <p className="text-sm text-gray-500">Up to 5 photos • Max 10MB each</p>
            </div>

            <button 
              onClick={next} 
              className="w-full h-12 bg-[#FF6B35] text-white rounded-xl font-semibold hover:brightness-110 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0E1F33] mb-2">Post Details</h2>
              <p className="text-gray-600">Tell buyers what you're selling</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0E1F33] mb-2">Title</label>
                <input 
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="What are you selling?"
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0E1F33] mb-2">Description</label>
                <textarea 
                  className="w-full h-24 px-4 py-3 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                  placeholder="Describe your item, condition, etc."
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0E1F33] mb-2">Price</label>
                <input 
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter price (optional)"
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0E1F33] mb-2">Location</label>
                <input 
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Where can buyers pick up?"
                  value={form.location} 
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                />
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-[#F5F7FA] rounded-xl">
                <input 
                  type="checkbox" 
                  id="flash-deal"
                  checked={form.is_flash_deal} 
                  onChange={(e) => setForm({ ...form, is_flash_deal: e.target.checked })} 
                  className="w-5 h-5 text-[#FF6B35] border-[#E6E9EE] rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="flash-deal" className="text-sm text-[#0E1F33]">
                  Show in Live Now feed
                </label>
              </div>
            </div>

            <button 
              onClick={submit} 
              disabled={isCreatingPost || !form.title || !form.description || !form.location} 
              className={`w-full h-12 rounded-xl font-semibold transition-colors ${
                isCreatingPost || !form.title || !form.description || !form.location
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#FF6B35] text-white hover:brightness-110'
              }`}
            >
              {isCreatingPost ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;



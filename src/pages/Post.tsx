import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useAppStore } from '../lib/store';
import { storage } from '../lib/supabase';
import { 
  ChevronLeftIcon, 
  PhotoIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { log } from '../lib/logger'

const Post: React.FC = () => {
  const { currentUser } = useAuth();
  const { createPost, isCreatingPost } = usePosts();
  const { setError, clearError } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [liveDuration, setLiveDuration] = useState<'15m' | '30m' | '60m'>('30m');
  const [form, setForm] = useState({
    type: 'item' as 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet',
    category: '',
    images: [] as string[],
    title: '',
    description: '',
    price: '',
    location: '',
    is_flash_deal: false,
    expires_at: '' as string,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const next = () => setStep((s) => (s === 3 ? s : ((s + 1) as any)));
  const back = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep((s) => (s === 1 ? s : ((s - 1) as any)));
    }
  };

  // Price helpers: keep at most two decimals while typing and format to exactly 2 on blur
  const sanitizePriceInput = (input: string): string => {
    if (!input) return ''
    // allow only digits and a single dot
    const cleaned = input.replace(/[^0-9.]/g, '')
    const [integerPart = '', decimalRaw = ''] = cleaned.split('.')
    const decimalPart = decimalRaw.slice(0, 2)
    return cleaned.includes('.') ? `${integerPart}.${decimalPart}` : integerPart
  }

  const formatPriceToTwoDecimals = (input: string): string => {
    const num = parseFloat(input)
    if (Number.isNaN(num)) return ''
    return num.toFixed(2)
  }

  const submit = async () => {
    if (!currentUser?.id) {
      setError('You must be logged in to create a post');
      return;
    }

    // Validate required fields
    if (!form.title.trim()) {
      setError('Please enter a title for your post');
      return;
    }
    if (!form.description.trim()) {
      setError('Please enter a description for your post');
      return;
    }
    if (!form.location.trim()) {
      setError('Please enter a location for your post');
      return;
    }
    if (!form.category) {
      setError('Please select a category for your post');
      return;
    }

    clearError();
    
    try {
      log('🔍 [Post] Starting post creation...', {
        user_id: currentUser.id,
        title: form.title.trim(),
        category: form.category,
        type: form.type
      });

      // Compute flash deal expiry if enabled
      let flash_deal_expires_at: string | undefined = undefined
      if (form.is_flash_deal) {
        const minutes = liveDuration === '15m' ? 15 : liveDuration === '60m' ? 60 : 30
        flash_deal_expires_at = new Date(Date.now() + minutes * 60 * 1000).toISOString()
      }

      // Upload images to storage
      let imageUrls: string[] = []
      try {
        if (selectedFiles.length > 0) {
          imageUrls = await storage.uploadPostImages(selectedFiles, currentUser.id)
        }
      } catch (upErr) {
        console.error('❌ [Post] Image upload failed:', upErr)
        setError('Image upload failed. Please try again.')
        return
      }

      const postData = {
        user_id: currentUser.id,
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : undefined,
        category: form.category,
        location: form.location.trim(),
        images: imageUrls,
        status: 'active' as const,
        tags: [],
        is_flash_deal: form.is_flash_deal,
        flash_deal_expires_at,
        expires_at: form.expires_at ? new Date(`${form.expires_at}T23:59:59`).toISOString() : undefined,
      };

      log('🔍 [Post] Calling createPost with data:', postData);
      
      const result = await createPost(postData);
      
      log('✅ [Post] Post created successfully:', result);
      
      // Show success message
      setShowSuccess(true);
      
      // Navigate to home after a short delay with toast state
      setTimeout(() => {
        navigate('/', { state: { toast: 'Posted!' } });
      }, 1200);
      
    } catch (error) {
      console.error('❌ [Post] Failed to create post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post. Please try again.');
    }
  };

  const isFormValid = () => {
    return form.title.trim() && 
           form.description.trim() && 
           form.location.trim() && 
           form.category;
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
                { value: 'Tickets', icon: '🎟' }
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

              <div className="bg-white border-2 border-dashed border-[#E6E9EE] rounded-xl p-6 text-center">
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5)
                    setSelectedFiles(files)
                    const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
                      const reader = new FileReader()
                      reader.onload = () => resolve(String(reader.result))
                      reader.onerror = reject
                      reader.readAsDataURL(file)
                    })
                    const previews = await Promise.all(files.map(toDataUrl))
                    setForm({ ...form, images: previews.slice(0, 5) })
                  }}
                />
                <button
                  onClick={() => document.getElementById('image-input')?.click()}
                  className="inline-flex items-center px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-semibold hover:brightness-110"
                >
                  <PhotoIcon className="h-5 w-5 mr-2" /> Add photos
                </button>
                <p className="text-sm text-gray-500 mt-2">Up to 5 photos • Max 10MB each</p>
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`upload-${idx}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                        className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

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
                <label htmlFor="post-title" className="block text-sm font-semibold text-[#0E1F33] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="post-title" 
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="What are you selling?"
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>
              
              <div>
                <label htmlFor="post-description" className="block text-sm font-semibold text-[#0E1F33] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="post-description" 
                  className="w-full h-24 px-4 py-3 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                  placeholder="Describe your item, condition, etc."
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                />
              </div>
              
              <div>
                <label htmlFor="post-price" className="block text-sm font-semibold text-[#0E1F33] mb-2">Price</label>
                <input
                  id="post-price"
                  type="text"
                  inputMode="decimal"
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter price (optional)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: sanitizePriceInput(e.target.value) })}
                  onBlur={(e) => setForm({ ...form, price: formatPriceToTwoDecimals(e.target.value) })}
                />
              </div>

              <div>
                <label htmlFor="post-expiry" className="block text-sm font-semibold text-[#0E1F33] mb-2">Expiry Date</label>
                <input
                  id="post-expiry"
                  type="date"
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Listing will be marked expired after this date.</p>
              </div>
              
              <div>
                <label htmlFor="post-location" className="block text-sm font-semibold text-[#0E1F33] mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="post-location" 
                  className="w-full h-12 px-4 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Where can buyers pick up?"
                  value={form.location} 
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                />
              </div>
              
              <div className="p-4 bg-[#F5F7FA] rounded-xl space-y-3">
                <div className="flex items-center space-x-3">
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
                {form.is_flash_deal && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="post-live-duration" className="block text-sm font-semibold text-[#0E1F33] mb-2">Live Duration</label>
                      <select
                        id="post-live-duration"
                        className="w-full h-12 px-3 border border-[#E6E9EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        value={liveDuration}
                        onChange={(e) => setLiveDuration(e.target.value as any)}
                      >
                        <option value="15m">15 minutes</option>
                        <option value="30m">30 minutes</option>
                        <option value="60m">1 hour</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Live posts auto-expire after this time.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={submit} 
              disabled={isCreatingPost || !isFormValid()} 
              className={`w-full h-12 rounded-xl font-semibold transition-colors ${
                isCreatingPost || !isFormValid()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#FF6B35] text-white hover:brightness-110'
              }`}
            >
              {isCreatingPost ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                'Post Item'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center"
            >
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0E1F33] mb-2">Post Created!</h3>
              <p className="text-gray-600 mb-6">Your item has been successfully posted and is now live.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/', { state: { toast: 'Posted!' } })}
                  className="flex-1 bg-[#FF6B35] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition-colors"
                >
                  View Posts
                </button>
                <button
                  onClick={() => navigate('/', { state: { toast: 'Posted!' } })}
                  className="flex-1 border border-[#E6E9EE] text-[#0E1F33] py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Post Another
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Post;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { useAppStore } from '../lib/store';
import { storage } from '../lib/supabase';
import { 
  ChevronLeftIcon, 
  PhotoIcon,
  CheckCircleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const CreateTicket: React.FC = () => {
  const { currentUser } = useAuth();
  const { createTicket, isCreatingTicket } = useTickets();
  const { setError, clearError } = useAppStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if user doesn't have campus_id
  React.useEffect(() => {
    if (currentUser && !currentUser.campus_id) {
      setError('⚠️ Your account is missing campus information. Please update your profile.');
      navigate('/profile');
    }
  }, [currentUser, navigate, setError]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_name: '',
    event_date: '',
    event_venue: '',
    event_category: '' as 'sports' | 'concert' | 'party' | 'theater' | 'other' | '',
    price: '',
    quantity: '1',
    images: [] as string[],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const next = () => {
    setStep((s) => (s === 3 ? s : ((s + 1) as any)));
  };
  
  const back = () => {
    if (step === 1) {
      // Step 1: Go back to home
      navigate('/');
    } else {
      // Step 2 or 3: Go to previous step
      setStep((s) => (s === 1 ? s : ((s - 1) as any)));
    }
  };

  const sanitizePriceInput = (input: string): string => {
    if (!input) return ''
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
      setError('You must be logged in to create a ticket');
      return;
    }

    // Validate required fields
    if (!form.title.trim()) {
      setError('Please enter a title for your ticket');
      return;
    }
    if (!form.event_name.trim()) {
      setError('Please enter the event name');
      return;
    }
    if (!form.event_date) {
      setError('Please select the event date');
      return;
    }
    if (!form.event_category) {
      setError('Please select an event category');
      return;
    }
    if (!currentUser.campus_id) {
      setError('⚠️ Your account is missing campus information. Please sign out and create a new account with your .edu email.');
      return;
    }

    clearError();
    
    try {
      // Upload images to storage
      let imageUrls: string[] = []
      try {
        if (selectedFiles.length > 0) {
          imageUrls = await storage.uploadPostImages(selectedFiles, currentUser.id)
        }
      } catch (upErr) {
        console.error('Image upload failed:', upErr)
        setError('Image upload failed. Please try again.')
        return
      }

      const ticketData = {
        seller_id: currentUser.id,
        campus_id: currentUser.campus_id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        event_name: form.event_name.trim(),
        event_date: new Date(form.event_date).toISOString(),
        event_venue: form.event_venue.trim() || null,
        price: form.price ? parseFloat(form.price) : null,
        quantity: parseInt(form.quantity) || 1,
        images: imageUrls,
      };
      
      await createTicket(ticketData);
      
      // Show success message
      setShowSuccess(true);
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/', { state: { toast: 'Ticket posted!' } });
      }, 1200);
      
    } catch (error) {
      console.error('❌ [CreateTicket] Failed to create ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create ticket. Please try again.';
      console.error('❌ [CreateTicket] Error details:', {
        message: errorMessage,
        error: error,
        user: currentUser,
        form: form
      });
      setError(errorMessage);
    }
  };

  const isFormValid = () => {
    return form.title.trim() && 
           form.event_name.trim() && 
           form.event_date &&
           form.event_category;
  };

  const eventCategories = [
    { value: 'sports', icon: '🏈', label: 'Sports' },
    { value: 'concert', icon: '🎵', label: 'Concert' },
    { value: 'party', icon: '🎉', label: 'Party' },
    { value: 'theater', icon: '🎭', label: 'Theater' },
    { value: 'other', icon: '🎟️', label: 'Other' }
  ];

  const { error: globalError } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={back} 
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
            aria-label="Back"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-700 group-hover:text-indigo-600" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
              {step === 1 ? 'Cancel' : 'Back'}
            </span>
          </button>
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-5 w-5 text-indigo-600" />
            <h1 className="text-lg font-bold text-gray-900">
              {step === 1 && 'Event Details'}
              {step === 2 && 'Add Photos'}
              {step === 3 && 'Ticket Info'}
            </h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Error Banner */}
      {globalError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <p className="text-red-800 text-sm text-center font-medium">{globalError}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Event</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-3">
            <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 w-full' : 'w-0'}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Photos</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-3">
            <div className={`h-full transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 w-full' : 'w-0'}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 3 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-2">What event is this for?</h2>
              <p className="text-gray-600 mb-6">Select the category and provide event details</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {eventCategories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setForm({ ...form, event_category: category.value as any })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          form.event_category === category.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="font-semibold text-sm text-gray-900">{category.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Purdue vs Indiana Basketball"
                    value={form.event_name} 
                    onChange={(e) => setForm({ ...form, event_name: e.target.value })} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="datetime-local"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={form.event_date} 
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Venue
                  </label>
                  <input 
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Mackey Arena"
                    value={form.event_venue} 
                    onChange={(e) => setForm({ ...form, event_venue: e.target.value })} 
                  />
                </div>
              </div>

              <button 
                onClick={next} 
                disabled={!form.event_name || !form.event_date || !form.event_category} 
                className={`w-full h-12 rounded-xl font-semibold mt-6 transition-all ${
                  form.event_name && form.event_date && form.event_category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Add Photos</h2>
              <p className="text-gray-600 mb-6">Upload screenshots or photos of your tickets</p>

              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
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
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <button
                  onClick={() => document.getElementById('image-input')?.click()}
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md"
                >
                  <PhotoIcon className="h-5 w-5 mr-2" /> Select Photos
                </button>
                <p className="text-sm text-gray-500 mt-3">Up to 5 photos • JPG, PNG, or WebP</p>
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`upload-${idx}`} className="w-full h-28 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })
                          setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={next} 
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all mt-6 shadow-lg"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket Details</h2>
              <p className="text-gray-600 mb-6">Price and description</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., 2 Floor Seats - Row 5"
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    className="w-full h-24 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Additional details about the tickets..."
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price per Ticket ($)
                    </label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: sanitizePriceInput(e.target.value) })}
                      onBlur={(e) => setForm({ ...form, price: formatPriceToTwoDecimals(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="99"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-4">
                  <p className="text-sm text-indigo-900">
                    💡 <strong>Payment:</strong> Buyers will contact you directly via Snapchat, Instagram, or phone. 
                    Accept payment through Venmo, Zelle, or cash.
                  </p>
                </div>
              </div>

              <button 
                onClick={submit} 
                disabled={isCreatingTicket || !isFormValid() || !currentUser?.campus_id} 
                className={`w-full h-12 rounded-xl font-semibold mt-6 transition-all ${
                  isCreatingTicket || !isFormValid() || !currentUser?.campus_id
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                }`}
              >
                {isCreatingTicket ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Posting...</span>
                  </div>
                ) : !currentUser?.campus_id ? (
                  'Missing Campus Info'
                ) : (
                  'Post Ticket'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Posted!</h3>
              <p className="text-gray-600 mb-6">Your ticket is now live and visible to your campus.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateTicket;


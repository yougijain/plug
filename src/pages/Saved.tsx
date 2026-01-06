import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSavedTickets } from '../hooks/useTickets';
import {
  ChevronLeftIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Example saved tickets for demo
const EXAMPLE_SAVED_TICKETS: any[] = [
  {
    id: 'saved-1',
    seller_id: 'seller-1',
    event_id: null,
    campus_id: 'iu-campus-id',
    title: '2 Lower Bowl Tickets',
    description: 'Great seats! Section 112, Row 15. Can meet on campus or transfer digitally.',
    event_name: 'Purdue vs Indiana Basketball',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event_venue: 'Assembly Hall',
    price: 85.00,
    quantity: 2,
    quantity_sold: 0,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'],
    views: 42,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    sold_at: null,
    users: {
      name: 'Alex Johnson',
      reputation_score: 92,
      successful_sales: 15,
      avatar: null,
      university: 'Indiana University',
      snapchat_handle: null,
      instagram_handle: null,
      phone_number: null
    }
  },
  {
    id: 'saved-2',
    seller_id: 'seller-2',
    event_id: null,
    campus_id: 'iu-campus-id',
    title: 'Student Section - 4 Tickets',
    description: 'Selling 4 student section tickets together. Must buy all 4. Great for a group!',
    event_name: 'IU Homecoming Concert',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    event_venue: 'Memorial Stadium',
    price: 45.00,
    quantity: 4,
    quantity_sold: 0,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400'],
    views: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    sold_at: null,
    users: {
      name: 'Sam Martinez',
      reputation_score: 88,
      successful_sales: 8,
      avatar: null,
      university: 'Indiana University',
      snapchat_handle: null,
      instagram_handle: null,
      phone_number: null
    }
  }
];

const Saved: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { savedTickets: apiSavedTickets, isLoading, unsaveTicket } = useSavedTickets(currentUser?.id);
  
  // Use API tickets, fallback to examples only in development
  const savedTickets = (apiSavedTickets && apiSavedTickets.length > 0) 
    ? apiSavedTickets 
    : (process.env.NODE_ENV === 'development' ? EXAMPLE_SAVED_TICKETS : []);

  const handleBack = () => {
    navigate('/');
  };

  const handleUnsave = async (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    if (!currentUser?.id) return;
    await unsaveTicket({ userId: currentUser.id, ticketId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="grid grid-cols-3 items-center max-w-4xl mx-auto">
          <div className="justify-self-start">
            <button 
              onClick={handleBack} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Back"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <h1 className="justify-self-center text-lg font-bold text-gray-900">Saved Tickets</h1>
          <div className="justify-self-end w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-md animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : savedTickets.length > 0 ? (
          // Saved tickets list
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {savedTickets.map((ticket, index) => (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all overflow-hidden"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                {/* Ticket Image */}
                {Array.isArray(ticket.images) && ticket.images.length > 0 && (
                  <div className="w-full h-48 bg-gray-100">
                    <img 
                      src={ticket.images[0]} 
                      alt={ticket.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  {/* Event Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{ticket.event_name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(new Date(ticket.event_date), 'MMM d, h:mm a')}</span>
                        </div>
                        {ticket.event_venue && (
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{ticket.event_venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleUnsave(e, ticket.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove from saved"
                    >
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    </button>
                  </div>

                  {/* Ticket Title */}
                  <p className="font-semibold text-gray-900 mb-2">{ticket.title}</p>

                  {/* Description */}
                  {ticket.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                  )}

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${ticket.price ? ticket.price.toFixed(2) : 'Free'}
                      </span>
                      {ticket.price && <span className="text-sm text-gray-500 ml-1">per ticket</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{ticket.quantity - ticket.quantity_sold}</span> available
                    </div>
                  </div>

                  {/* Seller Info */}
                  {ticket.users && (
                    <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {ticket.users.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ticket.users.name}</p>
                        <p className="text-xs text-gray-500">⭐ {ticket.users.reputation_score} points • {ticket.users.successful_sales} sales</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {ticket.status !== 'active' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        {ticket.status === 'sold' ? 'Sold Out' : 'Unavailable'}
                      </span>
                    </div>
                  )}
                  
                  {/* View Details Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tickets/${ticket.id}`);
                    }}
                    className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty state
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No saved tickets yet</h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Save tickets you're interested in to easily find them later.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Browse Tickets
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;

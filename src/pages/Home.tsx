import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTickets, useSavedTickets } from '../hooks/useTickets';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  HeartIcon,
  BellIcon,
  TicketIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Example tickets for demo
const EXAMPLE_TICKETS: any[] = [
  {
    id: 'ticket-1',
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
    id: 'ticket-2',
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
  },
  {
    id: 'ticket-3',
    seller_id: 'seller-3',
    event_id: null,
    campus_id: 'iu-campus-id',
    title: 'Single Ticket - Center Court',
    description: 'One ticket, Section 201 center court. Can\'t make it to the game unfortunately.',
    event_name: 'Indiana vs Michigan State',
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    event_venue: 'Assembly Hall',
    price: 120.00,
    quantity: 1,
    quantity_sold: 0,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'],
    views: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    sold_at: null,
    users: {
      name: 'Jordan Lee',
      reputation_score: 95,
      successful_sales: 22,
      avatar: null,
      university: 'Indiana University',
      snapchat_handle: null,
      instagram_handle: null,
      phone_number: null
    }
  },
  {
    id: 'ticket-4',
    seller_id: 'seller-4',
    event_id: null,
    campus_id: 'iu-campus-id',
    title: 'Theater Show - 2 Tickets',
    description: 'Two tickets for the student theater production. Great seats in the middle section.',
    event_name: 'Spring Theater Showcase',
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    event_venue: 'IU Auditorium',
    price: 25.00,
    quantity: 2,
    quantity_sold: 0,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1503095396549-807759245b35?w=400'],
    views: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    sold_at: null,
    users: {
      name: 'Taylor Chen',
      reputation_score: 85,
      successful_sales: 5,
      avatar: null,
      university: 'Indiana University',
      snapchat_handle: null,
      instagram_handle: null,
      phone_number: null
    }
  }
];

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets: apiTickets, isLoading } = useTickets({ 
    campusId: currentUser?.campus_id || undefined,
    status: 'active'
  });
  const { savedTickets, saveTicket, unsaveTicket } = useSavedTickets(currentUser?.id);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const [hasNotifications] = useState(true);
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);
  
  // Use example tickets if API returns empty, otherwise use API tickets
  const tickets = (apiTickets && apiTickets.length > 0) ? apiTickets : EXAMPLE_TICKETS;

  // Toast handler for redirects
  useEffect(() => {
    const state = location.state as any;
    if (state?.toast) {
      setToast(state.toast);
      window.history.replaceState({}, document.title);
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const handleSaveTicket = async (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    if (!currentUser?.id) return;

    const isSaved = savedTickets.some(t => t.id === ticketId);
    if (isSaved) {
      await unsaveTicket({ userId: currentUser.id, ticketId });
    } else {
      await saveTicket({ userId: currentUser.id, ticketId });
    }
  };

  const handleCreateTicket = () => {
    navigate('/create-ticket');
  };

  const handleCart = () => {
    navigate('/saved');
  };

  const handleNotifications = () => {
    // TODO: implement notifications panel
  };

  // Filter tickets based on search and category
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.event_venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      ticket.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      ticket.event_name.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'All', icon: '🎟️' },
    { value: 'Sports', icon: '🏈' },
    { value: 'Concert', icon: '🎵' },
    { value: 'Party', icon: '🎉' },
    { value: 'Theater', icon: '🎭' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSaved = (ticketId: string) => savedTickets.some(t => t.id === ticketId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        {/* Toast */}
        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 top-2 z-50">
            <div className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow-lg">
              {toast}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {/* Left side - Logo and wordmark */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TicketPlug
              </h1>
              <p className="text-xs text-gray-500">{currentUser?.university || 'Loading...'}</p>
            </div>
          </div>
          
          {/* Right side - Icons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCart}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Saved tickets"
            >
              <HeartIcon className="h-6 w-6" />
              {savedTickets.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                  {savedTickets.length}
                </span>
              )}
            </button>
            <button 
              onClick={handleNotifications}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-600"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search Row */}
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets, events, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen((v) => !v)}
                className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center space-x-2 hover:bg-gray-100 transition-colors"
              >
                <FunnelIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{selectedCategory}</span>
              </button>
              {isCategoryOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  <div className="py-1">
                    {categories.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setSelectedCategory(c.value);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left ${
                          selectedCategory === c.value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span className="w-6 text-center text-lg">{c.icon}</span>
                        <span>{c.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Quick Actions */}
        <div className="mb-6">
          <button
            onClick={handleCreateTicket}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <TicketIcon className="h-5 w-5" />
            <span>Sell Your Tickets</span>
          </button>
        </div>

        {/* Feed */}
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-md animate-pulse">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length > 0 ? (
          // Tickets feed
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTickets.map((ticket, index) => (
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
                      onClick={(e) => handleSaveTicket(e, ticket.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {isSaved(ticket.id) ? (
                        <HeartSolidIcon className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIcon className="h-6 w-6" />
                      )}
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
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TicketIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No tickets yet</h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Be the first to list tickets on your campus!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateTicket}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Post Your First Ticket
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

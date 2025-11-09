import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTicket } from '../hooks/useTickets';
import { useReports } from '../hooks/useReports';
import {
  ChevronLeftIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { ticket, isLoading } = useTicket(id);
  const { createReport, isCreatingReport } = useReports();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReport = async () => {
    if (!currentUser?.id || !ticket?.id || !reportReason) return;

    try {
      await createReport({
        reporter_id: currentUser.id,
        reported_ticket_id: ticket.id,
        reason: reportReason,
        description: reportDescription || null
      });
      
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      alert('Report submitted. Our team will review it shortly.');
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && ticket) {
      try {
        await navigator.share({
          title: ticket.title,
          text: `Check out this ticket: ${ticket.event_name}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleContactSeller = () => {
    setShowContactInfo(true);
  };

  const reportReasons = [
    'Fake or fraudulent listing',
    'Inappropriate content',
    'Price gouging',
    'Duplicate listing',
    'Spam',
    'Other'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket not found</h3>
          <p className="text-gray-600 mb-4">This ticket may have been removed or sold.</p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isSeller = currentUser?.id === ticket.seller_id;
  const isAvailable = ticket.status === 'active' && (ticket.quantity - ticket.quantity_sold) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button 
          onClick={handleBack} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Back"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Ticket Details</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share"
          >
            <ShareIcon className="h-5 w-5 text-gray-700" />
          </button>
          {!isSeller && (
            <button 
              onClick={() => setShowReportModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Report"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {/* Image Gallery */}
        {ticket.images && ticket.images.length > 0 && (
          <div className="relative bg-black">
            <img 
              src={ticket.images[currentImageIndex]} 
              alt={ticket.title}
              className="w-full h-80 object-contain"
            />
            {ticket.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {ticket.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                {currentImageIndex > 0 && (
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-900" />
                  </button>
                )}
                {currentImageIndex < ticket.images.length - 1 && (
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-900 rotate-180" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            {isAvailable ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                Sold Out
              </span>
            )}
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{ticket.event_name}</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{format(new Date(ticket.event_date), 'EEEE, MMMM d, yyyy • h:mm a')}</span>
              </div>
              {ticket.event_venue && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{ticket.event_venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{ticket.title}</h3>
            {ticket.description && (
              <p className="text-gray-600 mb-4">{ticket.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Price per Ticket</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${ticket.price ? ticket.price.toFixed(2) : 'Free'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ticket.quantity - ticket.quantity_sold} / {ticket.quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          {ticket.users && (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {ticket.users.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{ticket.users.name}</p>
                  <p className="text-sm text-gray-500">{ticket.users.university}</p>
                </div>
              </div>
              
              {/* Reputation */}
              <div className="flex items-center space-x-6 py-3 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Reputation</p>
                  <p className="text-lg font-bold text-indigo-600">⭐ {ticket.users.reputation_score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Successful Sales</p>
                  <p className="text-lg font-bold text-gray-900">{ticket.users.successful_sales}</p>
                </div>
              </div>

              {/* Contact Info - Initially Hidden */}
              {!isSeller && isAvailable && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {!showContactInfo ? (
                    <button
                      onClick={handleContactSeller}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Contact Seller
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Contact via:</p>
                      
                      {ticket.users.snapchat_handle && (
                        <a
                          href={`https://www.snapchat.com/add/${ticket.users.snapchat_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-xl">
                            👻
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Snapchat</p>
                            <p className="text-sm text-gray-600">@{ticket.users.snapchat_handle}</p>
                          </div>
                        </a>
                      )}

                      {ticket.users.instagram_handle && (
                        <a
                          href={`https://www.instagram.com/${ticket.users.instagram_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                            📷
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Instagram</p>
                            <p className="text-sm text-gray-600">@{ticket.users.instagram_handle}</p>
                          </div>
                        </a>
                      )}

                      {ticket.users.phone_number && (
                        <a
                          href={`tel:${ticket.users.phone_number}`}
                          className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                            📱
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">{ticket.users.phone_number}</p>
                          </div>
                        </a>
                      )}

                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-indigo-900">
                          💡 <strong>Payment:</strong> Arrange payment via Venmo, Zelle, or cash. 
                          Meet in a public place on campus for safety.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isSeller && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>This is your listing.</strong> Buyers will contact you when they're interested.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Report Ticket</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a reason</option>
                    {reportReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={4}
                    placeholder="Provide more details about the issue..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={!reportReason || isCreatingReport}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      !reportReason || isCreatingReport
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isCreatingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketDetail;


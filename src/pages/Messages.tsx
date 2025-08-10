import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages } from '../hooks/useMessages';
import { useAppStore } from '../lib/store';
import { Conversation, Message } from '../types/index';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  EllipsisHorizontalIcon, 
  CameraIcon, 
  PlusIcon, 
  CurrencyDollarIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Extended conversation type for demo data
interface DemoConversation extends Conversation {
  listing_title: string;
  listing_price: number;
  listing_image: string | null;
}

const Messages: React.FC = () => {
  const { currentUser } = useAuth();
  const { conversations, isLoading: isLoadingConversations } = useConversations(currentUser?.id || '');
  const { error } = useAppStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages(selectedConversation || '');

  // Create demo conversations if none exist
  const demoConversations = useMemo((): DemoConversation[] => {
    if (conversations.length === 0) {
      return [
        {
          id: 'conv-1',
          participants: [currentUser?.id || 'user1', 'user2'],
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread_count: 2,
          listing_title: 'iPhone 13 Pro',
          listing_price: 750,
          listing_image: null
        },
        {
          id: 'conv-2',
          participants: [currentUser?.id || 'user1', 'user3'],
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unread_count: 0,
          listing_title: 'Calculus Textbook',
          listing_price: 45,
          listing_image: null
        },
        {
          id: 'conv-3',
          participants: [currentUser?.id || 'user1', 'user4'],
          created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          unread_count: 1,
          listing_title: 'Bike for Sale',
          listing_price: 120,
          listing_image: null
        }
      ];
    }
    // Convert real conversations to demo format with default listing info
    return conversations.map(conv => ({
      ...conv,
      listing_title: 'Listing', // Default value for real conversations
      listing_price: 0, // Default value for real conversations
      listing_image: null // Default value for real conversations
    }));
  }, [conversations, currentUser?.id]);

  // Create demo messages for each conversation
  const demoMessages = useMemo(() => {
    const messages: {[conversationId: string]: Message[]} = {};
    
    demoConversations.forEach(conv => {
      messages[conv.id] = [
        {
          id: `msg-${conv.id}-1`,
          sender_id: conv.participants.find((id: string) => id !== currentUser?.id) || 'user2',
          receiver_id: currentUser?.id || 'user1',
          conversation_id: conv.id,
          content: `Hey! I'm interested in your ${conv.listing_title}. Is it still available?`,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: `msg-${conv.id}-2`,
          sender_id: currentUser?.id || 'user1',
          receiver_id: conv.participants.find((id: string) => id !== currentUser?.id) || 'user2',
          conversation_id: conv.id,
          content: `Yes, it's still available! Would you like to meet up?`,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          id: `msg-${conv.id}-3`,
          sender_id: conv.participants.find((id: string) => id !== currentUser?.id) || 'user2',
          receiver_id: currentUser?.id || 'user1',
          conversation_id: conv.id,
          content: `Perfect! Can we meet at the library tomorrow at 2pm?`,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: conv.unread_count > 0,
        }
      ];
    });
    
    return messages;
  }, [demoConversations, currentUser?.id]);

  // Use demo messages if no real messages exist
  const displayMessages = useMemo(() => {
    return selectedConversation 
      ? (messages.length > 0 ? messages : demoMessages[selectedConversation] || [])
      : [];
  }, [selectedConversation, messages, demoMessages]);

  // Get conversations with last message info
  const conversationsWithLastMessage = useMemo(() => {
    return demoConversations.map(conv => {
      const convMessages = demoMessages[conv.id] || [];
      const lastMessage = convMessages[convMessages.length - 1];
      
      return {
        ...conv,
        lastMessage: lastMessage?.content || 'No messages yet',
        lastTime: lastMessage?.created_at || conv.updated_at,
        otherParticipant: conv.participants.find((id: string) => id !== currentUser?.id) || 'user2'
      };
    }).sort((a, b) => {
      // Sort by unread count first, then by last message time
      if (a.unread_count !== b.unread_count) {
        return b.unread_count - a.unread_count;
      }
      return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
    });
  }, [demoConversations, demoMessages, currentUser?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [displayMessages, selectedConversation]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [selectedConversation]);

  const handleConversationSelect = (conversationId: string) => {
    console.log('🔍 [Messages] Selecting conversation:', conversationId);
    setSelectedConversation(conversationId);
    setMessageText(''); // Clear message input when switching conversations
  };

  const handleBackToConversations = () => {
    console.log('🔍 [Messages] Going back to conversations list');
    setSelectedConversation(null);
    setMessageText(''); // Clear message input
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation || !currentUser?.id) return;

    const otherParticipant = conversationsWithLastMessage.find(c => c.id === selectedConversation)?.otherParticipant || 'user2';

    // Add message to demo messages for immediate display
    const newMessage: Message = {
      id: `msg-${selectedConversation}-${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: otherParticipant,
      conversation_id: selectedConversation,
      content: messageText.trim(),
      created_at: new Date().toISOString(),
      read: false,
    };

    // Update demo messages
    demoMessages[selectedConversation] = [...(demoMessages[selectedConversation] || []), newMessage];

    // Try to send via API
    sendMessage({
      sender_id: currentUser.id,
      receiver_id: otherParticipant,
      conversation_id: selectedConversation,
      content: messageText.trim(),
      read: false,
    });

    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getSelectedConversationData = () => {
    return conversationsWithLastMessage.find(c => c.id === selectedConversation);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // CONVERSATION LIST VIEW
  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        {/* Header */}
        <div className="bg-white border-b border-[#E6E9EE] px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#0E1F33]">Messages</h1>
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Conversations List */}
        {isLoadingConversations ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-11 w-11 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : conversationsWithLastMessage.length > 0 ? (
          <div className="p-4 space-y-3">
            {conversationsWithLastMessage.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className="w-full text-left bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-11 w-11 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[15px] font-bold text-[#0E1F33] truncate">
                        User {conversation.otherParticipant}
                      </p>
                      <span className="text-[12px] text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conversation.lastTime)}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-600 truncate mb-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] text-gray-600 truncate flex-1">
                        {conversation.listing_title} • ${conversation.listing_price}
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#06D6A0] text-[#0E1F33] text-[12px] font-semibold flex-shrink-0 ml-2">
                          {conversation.unread_count} new
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start chatting when you contact someone about a listing</p>
          </div>
        )}
      </div>
    );
  }

  // INDIVIDUAL CHAT VIEW
  const selectedConvData = getSelectedConversationData();
  
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Chat Header */}
      <div className="bg-[#0E1F33] text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleBackToConversations} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back to conversations"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[16px] font-bold leading-tight">
              User {selectedConvData?.otherParticipant}
            </p>
            <p className="text-[12px] text-[#D8E1EE]">Active now</p>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="More options"
        >
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Pinned Listing Bar */}
      {selectedConvData && (
        <div className="px-4 pt-3">
          <div className="bg-white rounded-xl border border-[#E6E9EE] shadow-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-[#F5F7FA] rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">📱</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#0E1F33]">
                  {selectedConvData.listing_title}
                </p>
                <p className="text-[14px] font-bold text-[#0E1F33]">
                  ${selectedConvData.listing_price}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="h-9 px-3 rounded-lg border border-[#E6E9EE] text-[#0E1F33] text-sm font-semibold hover:bg-gray-50 transition-colors">
                Make offer
              </button>
              <button className="h-9 px-3 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold hover:brightness-110 transition-colors">
                Mark as sold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {displayMessages.map((message) => {
          const isOwnMessage = message.sender_id === currentUser?.id;
          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] break-words px-4 py-2 rounded-2xl overflow-hidden ${
                isOwnMessage 
                  ? 'bg-white border border-[#E6E9EE] text-[#0E1F33]' 
                  : 'bg-[#EEF2F7] text-[#0E1F33]'
              }`}>
                <p className="text-[14px]">{message.content}</p>
                <p className="text-[11px] text-[#8A8A8A] mt-1 text-right">
                  {formatTime(message.created_at)} • {isOwnMessage ? '✓✓' : '✓'}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {["Still available?", "Can meet today?", "Offer $XX"].map((reply) => (
            <button 
              key={reply} 
              onClick={() => setMessageText(reply)} 
              className="h-8 px-3 rounded-full bg-[#F5F7FA] border border-[#E6E9EE] text-[#0E1F33] text-sm hover:bg-gray-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-full shadow-lg border border-[#E6E9EE] h-14 px-3 flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Attachment"
          >
            <PlusIcon className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Camera"
          >
            <CameraIcon className="h-5 w-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message…"
            className="flex-1 px-2 outline-none text-[14px]"
          />
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Make offer"
          >
            <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
              messageText.trim() 
                ? 'bg-[#FF6B35] text-white hover:brightness-110' 
                : 'bg-[#FF6B35]/30 text-white/70 cursor-not-allowed'
            }`}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scroll to Bottom FAB */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 w-12 h-12 bg-[#FF6B35] text-white rounded-full shadow-lg flex items-center justify-center hover:brightness-110 transition-all z-40"
        >
          <ArrowDownIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Messages; 
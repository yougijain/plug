import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages } from '../hooks/useMessages';
import { useAppStore } from '../lib/store';
import { PaperAirplaneIcon, UserCircleIcon, MagnifyingGlassIcon, ChevronLeftIcon, EllipsisHorizontalIcon, CameraIcon, PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Messages: React.FC = () => {
  const { currentUser } = useAuth();
  const { conversations, isLoading: isLoadingConversations } = useConversations(currentUser?.id || '');
  const { error } = useAppStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localConversations, setLocalConversations] = useState<any[]>([]);
  const [localMessages, setLocalMessages] = useState<{[conversationId: string]: any[]}>({});

  const { messages, sendMessage, isLoading: isLoadingMessages } = useMessages(selectedConversation || '');

  // Initialize test messages for each conversation
  useEffect(() => {
    if (conversations.length > 0) {
      const initialMessages: {[conversationId: string]: any[]} = {};
      conversations.forEach(conv => {
        initialMessages[conv.id] = [
          {
            id: `test-${conv.id}-1`,
            sender_id: 'user2',
            receiver_id: currentUser?.id || 'user1',
            conversation_id: conv.id,
            content: `Test message from user2 in conversation ${conv.id}`,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
          },
          {
            id: `test-${conv.id}-2`,
            sender_id: currentUser?.id || 'user1',
            receiver_id: 'user2',
            conversation_id: conv.id,
            content: `Test message from current user in conversation ${conv.id}`,
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            read: true,
          }
        ];
      });
      setLocalMessages(initialMessages);
    }
  }, [conversations, currentUser?.id]);

  // Use local messages for the selected conversation
  const displayMessages = selectedConversation ? (localMessages[selectedConversation] || []) : [];

  // Derived conversations with last message/time and sorting (unread first, newest next)
  const listItems = useMemo(() => {
    const items = conversations.map((c: any) => {
      const msgs = localMessages[c.id] || [];
      const last = msgs[msgs.length - 1];
      return {
        ...c,
        lastMessage: last?.content || 'Tap to view',
        lastTime: last?.created_at || c.updated_at,
      };
    });
    return items.sort((a: any, b: any) => {
      const unreadA = a.unread_count > 0 ? 1 : 0;
      const unreadB = b.unread_count > 0 ? 1 : 0;
      if (unreadA !== unreadB) return unreadB - unreadA;
      return new Date(b.lastTime || 0).getTime() - new Date(a.lastTime || 0).getTime();
    });
  }, [conversations, localMessages]);

  // Debug logs
  console.log('🔍 [Messages] currentUser:', currentUser);
  console.log('🔍 [Messages] currentUser?.id:', currentUser?.id);
  console.log('🔍 [Messages] conversations:', conversations);
  console.log('🔍 [Messages] selectedConversation:', selectedConversation);
  console.log('🔍 [Messages] messages:', messages);
  console.log('🔍 [Messages] isLoadingMessages:', isLoadingMessages);
  
  // Check if messages are being filtered out
  if (messages && messages.length > 0) {
    console.log('🔍 [Messages] Message details:');
    messages.forEach((msg, index) => {
      console.log(`🔍 [Messages] Message ${index}:`, {
        id: msg.id,
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        content: msg.content,
        isOwnMessage: msg.sender_id === currentUser?.id
      });
    });
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      console.log('🔍 [Messages] Auto-selecting first conversation:', conversations[0].id);
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations, selectedConversation]);

  // Update local conversations when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0) {
      // Set different unread counts for testing - second conversation has unread messages
      const updatedConversations = conversations.map((conv, index) => ({
        ...conv,
        unread_count: index === 1 ? 2 : 0 // Second conversation has 2 unread, first has 0
      }));
      setLocalConversations(updatedConversations);
    }
  }, [conversations]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && localConversations.length > 0) {
      const conversation = localConversations.find(c => c.id === selectedConversation);
      if (conversation && conversation.unread_count > 0) {
        console.log('🔍 [Messages] Marking messages as read for conversation:', selectedConversation);
        
        // Update the local conversation to mark as read
        setLocalConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, unread_count: 0 }
              : conv
          )
        );
      }
    }
  }, [selectedConversation, localConversations]);

  const handleConversationSelect = (conversationId: string) => {
    console.log('🔍 [Messages] Selecting conversation:', conversationId);
    setSelectedConversation(conversationId);
    
    // Mark messages as read for this conversation
    setLocalConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation || !currentUser?.id) return;

    console.log('🔍 [Messages] Sending message:', {
      sender_id: currentUser.id,
      receiver_id: getOtherParticipant(conversations.find(c => c.id === selectedConversation)),
      conversation_id: selectedConversation,
      content: messageText.trim()
    });

    // Add the new message to the test messages for immediate display
    const newMessage = {
      id: Date.now().toString(),
      sender_id: currentUser.id,
      receiver_id: getOtherParticipant(conversations.find(c => c.id === selectedConversation)) || 'user2',
      conversation_id: selectedConversation,
      content: messageText.trim(),
      created_at: new Date().toISOString(),
      read: false,
    };

    // Update the test messages array
    setLocalMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
    }));

    // Try to send via API (this might fail in demo mode, but that's okay)
    sendMessage({
      sender_id: currentUser.id,
      receiver_id: getOtherParticipant(conversations.find(c => c.id === selectedConversation)) || 'user2',
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (conversation: any) => {
    if (!currentUser?.id || !conversation) return null;
    const otherId = conversation.participants.find((id: string) => id !== currentUser.id);
    return otherId;
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

  // Mobile-first: list or thread view
  const renderList = (
    <div className="min-h-[calc(100vh-64px)] bg-brandOffWhite">
      <div className="px-4 py-3 bg-white border-b border-neutral-200 flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-brandNavy">Messages</h1>
        <MagnifyingGlassIcon className="h-5 w-5 text-dark-600" />
      </div>
      {isLoadingConversations ? (
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-neutral-200 animate-pulse h-16" />
          ))}
        </div>
      ) : listItems.length > 0 ? (
        <div className="p-2">
          {listItems.map((conversation: any) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <button
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className="w-full text-left bg-white rounded-xl border border-neutral-200 p-3 mb-3 flex items-center"
              >
                <div className="h-11 w-11 rounded-full bg-brandOffWhite flex items-center justify-center mr-3">
                  <UserCircleIcon className="h-6 w-6 text-dark-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-bold text-brandNavy truncate">User {otherParticipant}</p>
                    <span className="text-[12px] text-dark-400">{new Date(conversation.lastTime||Date.now()).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[13px] text-dark-600 truncate">{conversation.lastMessage}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-[12px] text-dark-600 truncate">Listing • $—</div>
                    {conversation.unread_count > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-brandMint text-brandNavy text-[12px] font-semibold">{conversation.unread_count} new</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-dark-600">No conversations yet</div>
      )}
    </div>
  );

  const renderThread = (
    <div className="min-h-[calc(100vh-64px)] bg-brandOffWhite flex flex-col">
      {/* Thread Header */}
      <div className="bg-brandNavy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSelectedConversation(null)} aria-label="Back">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[16px] font-bold leading-tight">User {getOtherParticipant(conversations.find(c => c.id === selectedConversation))}</p>
            <p className="text-[12px] text-[#D8E1EE]">Active now</p>
          </div>
        </div>
        <button aria-label="More"><EllipsisHorizontalIcon className="h-6 w-6" /></button>
      </div>

      {/* Pinned listing bar (placeholder) */}
      <div className="px-4 pt-3">
        <div className="bg-white rounded-xl border border-neutral-200 shadow p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-brandOffWhite" />
            <div>
              <p className="text-[14px] font-semibold text-brandNavy">Listing title</p>
              <p className="text-[14px] font-bold text-brandNavy">$—</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="h-9 px-3 rounded-lg border border-neutral-300 text-brandNavy text-sm font-semibold">Make offer</button>
            <button className="h-9 px-3 rounded-lg bg-brandOrange text-white text-sm font-semibold">Mark as sold</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayMessages.map((message) => {
          const isOwnMessage = message.sender_id === currentUser?.id;
          return (
            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] break-words px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-white border border-[#E6E9EE] text-brandNavy' : 'bg-[#EEF2F7] text-brandNavy'}`}>
                <p className="text-[14px]">{message.content}</p>
                <p className="text-[11px] text-[#8A8A8A] mt-1 text-right">{formatTime(message.created_at)} • ✓✓</p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {["Still available?","Can meet today?","Offer $XX"].map((q) => (
            <button key={q} onClick={() => setMessageText(q)} className="h-8 px-3 rounded-full bg-brandOffWhite border border-neutral-300 text-brandNavy text-sm">{q}</button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-full shadow border border-neutral-200 h-14 px-3 flex items-center space-x-2">
          <button aria-label="Attachment"><PlusIcon className="h-5 w-5 text-dark-500" /></button>
          <button aria-label="Camera"><CameraIcon className="h-5 w-5 text-dark-500" /></button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message…"
            className="flex-1 px-2 outline-none text-[14px]"
          />
          <button aria-label="Offer"><CurrencyDollarIcon className="h-5 w-5 text-dark-500" /></button>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`h-9 w-9 rounded-full flex items-center justify-center ${messageText.trim() ? 'bg-brandOrange text-white' : 'bg-brandOrange/30 text-white/70 cursor-not-allowed'}`}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return selectedConversation ? renderThread : renderList;
};

export default Messages; 
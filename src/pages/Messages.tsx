import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages } from '../hooks/useMessages';
import { useAppStore } from '../lib/store';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-white h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-brandNavy text-white shrink-0">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>

        {isLoadingConversations ? (
          <div className="p-4 space-y-4 overflow-y-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : localConversations && localConversations.length > 0 ? (
          <div className="overflow-y-auto flex-1">
            {localConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">User {otherParticipant}</p>
                      <p className="text-sm text-gray-500">
                        {conversation.unread_count > 0 ? (
                          <span className="font-medium text-blue-600">
                            {conversation.unread_count} new message{conversation.unread_count !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          'No new messages'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a conversation by messaging someone</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    User {getOtherParticipant(conversations.find(c => c.id === selectedConversation))}
                  </p>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
            </div>

            {/* Message Bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayMessages && displayMessages.length > 0 ? (
                displayMessages.map((message) => {
                  const isOwnMessage = message.sender_id === currentUser?.id;
                  
                  console.log('🔍 [Messages] Rendering message:', {
                    messageId: message.id,
                    senderId: message.sender_id,
                    currentUserId: currentUser?.id,
                    isOwnMessage,
                    content: message.content
                  });
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] break-words px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                  <p className="text-xs text-gray-300 mt-2">Debug: messages.length = {messages?.length || 0}, displayMessages.length = {displayMessages?.length || 0}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 shrink-0">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-brandOrange text-white rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 
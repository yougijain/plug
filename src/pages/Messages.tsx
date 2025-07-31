import React, { useState } from 'react';
import { User, Conversation, Message } from '../types/index';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface MessagesProps {
  currentUser: User;
}

const Messages: React.FC<MessagesProps> = ({ currentUser }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data for MVP
  const conversations: Conversation[] = [
    {
      id: '1',
      participants: ['user1', currentUser.id],
      lastMessage: {
        id: 'msg1',
        senderId: 'user1',
        receiverId: currentUser.id,
        content: 'Hey! Is the MacBook still available?',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      unreadCount: 1,
    },
    {
      id: '2',
      participants: ['user2', currentUser.id],
      lastMessage: {
        id: 'msg2',
        senderId: currentUser.id,
        receiverId: 'user2',
        content: 'Thanks for the ride yesterday!',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      unreadCount: 0,
    },
    {
      id: '3',
      participants: ['user3', currentUser.id],
      lastMessage: {
        id: 'msg3',
        senderId: 'user3',
        receiverId: currentUser.id,
        content: 'Can you do the haircut tomorrow at 3 PM?',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
      },
      unreadCount: 1,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'user1',
      receiverId: currentUser.id,
      content: 'Hey! Is the MacBook still available?',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      read: true,
    },
    {
      id: '2',
      senderId: currentUser.id,
      receiverId: 'user1',
      content: 'Yes, it is! Are you interested?',
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      read: true,
    },
    {
      id: '3',
      senderId: 'user1',
      receiverId: currentUser.id,
      content: 'Perfect! Can I see it today?',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      alert(`Message sent: ${newMessage}`);
      setNewMessage('');
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(id => id !== currentUser.id) || 'Unknown';
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500">Connect with other students</p>
          </div>
        </div>
      </div>

      {selectedConversation ? (
        /* Chat View */
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-primary-600 text-sm font-medium"
              >
                ← Back
              </button>
              <div className="text-center">
                <h2 className="font-semibold text-gray-900">John Doe</h2>
                <p className="text-xs text-gray-500">MacBook Pro listing</p>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === currentUser.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUser.id ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Conversations List */
        <div className="px-4 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Conversations</h2>
            <p className="text-sm text-gray-500">Your recent conversations</p>
          </div>

          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {getOtherParticipant(conversation)}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No conversations yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start by contacting someone about their listing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages; 
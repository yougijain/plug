export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar?: string;
  verified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet';
  title: string;
  description: string;
  price?: number;
  category: string;
  location: string;
  images?: string[];
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'sold' | 'expired';
  tags: string[];
  isFlashDeal?: boolean;
  flashDealExpiresAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  postId?: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Ride {
  id: string;
  driverId: string;
  origin: string;
  destination: string;
  departureTime: Date;
  availableSeats: number;
  price: number;
  description?: string;
  status: 'active' | 'full' | 'completed';
}

export type TabType = 'home' | 'explore' | 'cruze' | 'live' | 'messages'; 
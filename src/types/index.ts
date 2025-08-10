export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar?: string;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet';
  title: string;
  description: string;
  price?: number;
  category: string;
  location: string;
  images?: string[];
  created_at: string;
  expires_at?: string;
  status: 'active' | 'sold' | 'expired';
  tags: string[];
  is_flash_deal?: boolean;
  flash_deal_expires_at?: string;
  // Joined user data
  users?: {
    name: string;
    avatar?: string;
    university: string;
  };
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  post_id?: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message_id?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
  // Listing information for the conversation
  listing_title?: string;
  listing_price?: number;
  listing_image?: string | null;
}

export interface Ride {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  description?: string;
  status: 'active' | 'full' | 'completed';
  created_at: string;
}

export type TabType = 'home' | 'live' | 'profile' | 'messages' | 'post';
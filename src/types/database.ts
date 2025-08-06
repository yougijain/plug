export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          university: string
          avatar?: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          university: string
          avatar?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          university?: string
          avatar?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet'
          title: string
          description: string
          price?: number
          category: string
          location: string
          images?: string[]
          created_at: string
          expires_at?: string
          status: 'active' | 'sold' | 'expired'
          tags: string[]
          is_flash_deal?: boolean
          flash_deal_expires_at?: string
          users?: {
            name: string
            avatar?: string
            university: string
          }
        }
        Insert: {
          id?: string
          user_id: string
          type: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet'
          title: string
          description: string
          price?: number
          category: string
          location: string
          images?: string[]
          created_at?: string
          expires_at?: string
          status?: 'active' | 'sold' | 'expired'
          tags?: string[]
          is_flash_deal?: boolean
          flash_deal_expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet'
          title?: string
          description?: string
          price?: number
          category?: string
          location?: string
          images?: string[]
          created_at?: string
          expires_at?: string
          status?: 'active' | 'sold' | 'expired'
          tags?: string[]
          is_flash_deal?: boolean
          flash_deal_expires_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          conversation_id: string
          post_id?: string
          content: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          conversation_id: string
          post_id?: string
          content: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          conversation_id?: string
          post_id?: string
          content?: string
          created_at?: string
          read?: boolean
        }
      }
      conversations: {
        Row: {
          id: string
          participants: string[]
          last_message_id?: string
          unread_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participants: string[]
          last_message_id?: string
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participants?: string[]
          last_message_id?: string
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          driver_id: string
          origin: string
          destination: string
          departure_time: string
          available_seats: number
          price: number
          description?: string
          status: 'active' | 'full' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          origin: string
          destination: string
          departure_time: string
          available_seats: number
          price: number
          description?: string
          status?: 'active' | 'full' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          origin?: string
          destination?: string
          departure_time?: string
          available_seats?: number
          price?: number
          description?: string
          status?: 'active' | 'full' | 'completed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
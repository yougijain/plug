// TicketPlug - Database Types
export type Database = {
  public: {
    Tables: {
      campuses: {
        Row: {
          id: string
          name: string
          domain: string
          location: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain: string
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          university: string
          campus_id: string | null
          avatar?: string | null
          verified: boolean
          email_verified: boolean
          is_edu_email: boolean
          snapchat_handle: string | null
          instagram_handle: string | null
          phone_number: string | null
          reputation_score: number
          successful_sales: number
          is_banned: boolean
          ban_reason: string | null
          banned_at: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          university: string
          campus_id?: string | null
          avatar?: string | null
          verified?: boolean
          email_verified?: boolean
          is_edu_email?: boolean
          snapchat_handle?: string | null
          instagram_handle?: string | null
          phone_number?: string | null
          reputation_score?: number
          successful_sales?: number
          is_banned?: boolean
          ban_reason?: string | null
          banned_at?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          university?: string
          campus_id?: string | null
          avatar?: string | null
          verified?: boolean
          email_verified?: boolean
          is_edu_email?: boolean
          snapchat_handle?: string | null
          instagram_handle?: string | null
          phone_number?: string | null
          reputation_score?: number
          successful_sales?: number
          is_banned?: boolean
          ban_reason?: string | null
          banned_at?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          campus_id: string | null
          name: string
          event_date: string
          venue: string | null
          description: string | null
          category: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campus_id?: string | null
          name: string
          event_date: string
          venue?: string | null
          description?: string | null
          category?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campus_id?: string | null
          name?: string
          event_date?: string
          venue?: string | null
          description?: string | null
          category?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          seller_id: string
          event_id: string | null
          campus_id: string
          title: string
          description: string | null
          price: number | null
          quantity: number
          quantity_sold: number
          event_name: string
          event_date: string
          event_venue: string | null
          images: string[]
          status: 'active' | 'sold' | 'expired' | 'removed'
          views: number
          created_at: string
          updated_at: string
          expires_at: string | null
          sold_at: string | null
          // Joined fields
          users?: {
            name: string
            avatar?: string | null
            university: string
            reputation_score: number
            successful_sales: number
            snapchat_handle: string | null
            instagram_handle: string | null
            phone_number: string | null
          }
          campuses?: {
            name: string
            domain: string
          }
        }
        Insert: {
          id?: string
          seller_id: string
          event_id?: string | null
          campus_id: string
          title: string
          description?: string | null
          price?: number | null
          quantity?: number
          quantity_sold?: number
          event_name: string
          event_date: string
          event_venue?: string | null
          images?: string[]
          status?: 'active' | 'sold' | 'expired' | 'removed'
          views?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          sold_at?: string | null
        }
        Update: {
          id?: string
          seller_id?: string
          event_id?: string | null
          campus_id?: string
          title?: string
          description?: string | null
          price?: number | null
          quantity?: number
          quantity_sold?: number
          event_name?: string
          event_date?: string
          event_venue?: string | null
          images?: string[]
          status?: 'active' | 'sold' | 'expired' | 'removed'
          views?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
          sold_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          reported_ticket_id: string | null
          reported_user_id: string | null
          reason: string
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by: string | null
          reviewed_at: string | null
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          reported_ticket_id?: string | null
          reported_user_id?: string | null
          reason: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string | null
          reported_ticket_id?: string | null
          reported_user_id?: string | null
          reason?: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
          created_at?: string
        }
      }
      reputation: {
        Row: {
          id: string
          user_id: string
          ticket_id: string | null
          change_amount: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_id?: string | null
          change_amount: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticket_id?: string | null
          change_amount?: number
          reason?: string
          created_at?: string
        }
      }
      saved_tickets: {
        Row: {
          id: string
          user_id: string
          ticket_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticket_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_edu_email: {
        Args: { email: string }
        Returns: boolean
      }
      extract_email_domain: {
        Args: { email: string }
        Returns: string
      }
      mark_ticket_sold: {
        Args: { 
          ticket_id: string
          quantity_to_mark?: number 
        }
        Returns: void
      }
      ban_user: {
        Args: { 
          user_id: string
          reason: string 
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

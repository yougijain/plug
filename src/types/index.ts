// Campus Connect - Tickets MVP Types
import type { Database } from './database'

export type Tables = Database['public']['Tables']

// Core types
export type Campus = Tables['campuses']['Row']
export type User = Tables['users']['Row']
export type Event = Tables['events']['Row']
export type Ticket = Tables['tickets']['Row']
export type Report = Tables['reports']['Row']
export type Reputation = Tables['reputation']['Row']
export type SavedTicket = Tables['saved_tickets']['Row']

// Insert types
export type CampusInsert = Tables['campuses']['Insert']
export type UserInsert = Tables['users']['Insert']
export type EventInsert = Tables['events']['Insert']
export type TicketInsert = Tables['tickets']['Insert']
export type ReportInsert = Tables['reports']['Insert']
export type ReputationInsert = Tables['reputation']['Insert']
export type SavedTicketInsert = Tables['saved_tickets']['Insert']

// Update types
export type CampusUpdate = Tables['campuses']['Update']
export type UserUpdate = Tables['users']['Update']
export type EventUpdate = Tables['events']['Update']
export type TicketUpdate = Tables['tickets']['Update']
export type ReportUpdate = Tables['reports']['Update']

// Status types
export type TicketStatus = 'active' | 'sold' | 'expired' | 'removed'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'

// Enum types
export type EventCategory = 'sports' | 'concert' | 'party' | 'theater' | 'other'

// Helper types
export interface SellerContact {
  name: string
  snapchat?: string
  instagram?: string
  phone?: string
  reputation: number
  totalSales: number
}

export interface TicketWithDetails extends Ticket {
  seller?: SellerContact
  campus?: {
    name: string
    domain: string
  }
}

// Campus Connect API
import { supabase } from './supabase'
import type { Database } from '../types/database'
import type { Campus, User, Ticket, Event, Report, TicketInsert, ReportInsert, EventInsert } from '../types'

type Tables = Database['public']['Tables']

// =============================================================================
// CAMPUSES API
// =============================================================================
export const campusesApi = {
  getAll: async (): Promise<Campus[]> => {
    console.log('🔍 [campusesApi.getAll] Fetching all campuses...')
    
    try {
      const { data, error } = await supabase
        .from('campuses')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error('❌ [campusesApi.getAll] Error:', error)
        throw error
      }
      
      console.log('✅ [campusesApi.getAll] Success:', data?.length || 0, 'campuses')
      return data || []
    } catch (err) {
      console.error('❌ [campusesApi.getAll] Exception:', err)
      throw err
    }
  },

  getByDomain: async (domain: string): Promise<Campus | null> => {
    console.log('🔍 [campusesApi.getByDomain] Fetching campus:', domain)
    
    try {
      const { data, error } = await supabase
        .from('campuses')
        .select('*')
        .eq('domain', domain.toLowerCase())
        .eq('is_active', true)
        .maybeSingle()
      
      if (error) {
        console.error('❌ [campusesApi.getByDomain] Error:', error)
        throw error
      }
      
      console.log('✅ [campusesApi.getByDomain] Success:', data ? 'found' : 'not found')
      return data
    } catch (err) {
      console.error('❌ [campusesApi.getByDomain] Exception:', err)
      throw err
    }
  }
}

// =============================================================================
// USERS API
// =============================================================================
export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    console.log('🔍 [userApi.getCurrentUser] Starting...')
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ [userApi.getCurrentUser] Auth error:', authError)
        throw authError
      }
      
      if (!user) {
        console.log('🔍 [userApi.getCurrentUser] No auth user found')
        return null
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('❌ [userApi.getCurrentUser] Database error:', error)
        throw error
      }
      
      console.log('✅ [userApi.getCurrentUser] Success')
      return data
    } catch (err) {
      console.error('❌ [userApi.getCurrentUser] Exception:', err)
      throw err
    }
  },

  createUser: async (params: {
    id: string
    email: string
    name: string
    university: string
    campus_id: string
    date_of_birth: string
    avatar?: string
  }): Promise<User> => {
    console.log('🔍 [userApi.createUser] Creating user...', params.email)
    
    try {
      // Validate .edu email
      const domain = params.email.split('@')[1]?.toLowerCase()
      const isEduEmail = domain?.endsWith('.edu') || false
      
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: params.id,
          email: params.email,
          name: params.name,
          university: params.university,
          campus_id: params.campus_id,
          avatar: params.avatar,
          date_of_birth: params.date_of_birth,
          is_edu_email: isEduEmail,
          email_verified: false,
          verified: false,
          reputation_score: 0,
          successful_sales: 0,
          is_banned: false
        }, { onConflict: 'id' })
        .select()
        .single()
      
      if (error) {
        console.error('❌ [userApi.createUser] Error:', error)
        throw error
      }
      
      console.log('✅ [userApi.createUser] Success')
      return data
    } catch (err) {
      console.error('❌ [userApi.createUser] Exception:', err)
      throw err
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    console.log('🔍 [userApi.updateProfile] Updating user:', userId)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [userApi.updateProfile] Error:', error)
        throw error
      }
      
      console.log('✅ [userApi.updateProfile] Success')
      return data
    } catch (err) {
      console.error('❌ [userApi.updateProfile] Exception:', err)
      throw err
    }
  },

  deleteAccount: async (userId: string): Promise<void> => {
    console.log('🔍 [userApi.deleteAccount] Deleting user:', userId)
    
    try {
      // First, delete all user's tickets
      await supabase.from('tickets').delete().eq('seller_id', userId)
      
      // Delete saved tickets
      await supabase.from('saved_tickets').delete().eq('user_id', userId)
      
      // Delete reports
      await supabase.from('reports').delete().eq('reporter_id', userId)
      
      // Delete reputation records
      await supabase.from('reputation').delete().eq('user_id', userId)
      
      // Finally, delete user
      const { error } = await supabase.from('users').delete().eq('id', userId)
      
      if (error) {
        console.error('❌ [userApi.deleteAccount] Error:', error)
        throw error
      }
      
      // Delete auth user
      await supabase.auth.admin.deleteUser(userId)
      
      console.log('✅ [userApi.deleteAccount] Success')
    } catch (err) {
      console.error('❌ [userApi.deleteAccount] Exception:', err)
      throw err
    }
  },

  getById: async (userId: string): Promise<User | null> => {
    console.log('🔍 [userApi.getById] Fetching user:', userId)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('❌ [userApi.getById] Error:', error)
        throw error
      }
      
      console.log('✅ [userApi.getById] Success')
      return data
    } catch (err) {
      console.error('❌ [userApi.getById] Exception:', err)
      throw err
    }
  }
}

// =============================================================================
// EVENTS API
// =============================================================================
export const eventsApi = {
  create: async (eventData: Omit<EventInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    console.log('🔍 [eventsApi.create] Creating event...', eventData.name)
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [eventsApi.create] Error:', error)
        throw error
      }
      
      console.log('✅ [eventsApi.create] Success')
      return data
    } catch (err) {
      console.error('❌ [eventsApi.create] Exception:', err)
      throw err
    }
  },

  getByCampus: async (campusId: string): Promise<Event[]> => {
    console.log('🔍 [eventsApi.getByCampus] Fetching events for campus:', campusId)
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('campus_id', campusId)
        .gte('event_date', new Date().toISOString())
        .order('event_date')
      
      if (error) {
        console.error('❌ [eventsApi.getByCampus] Error:', error)
        throw error
      }
      
      console.log('✅ [eventsApi.getByCampus] Success:', data?.length || 0, 'events')
      return data || []
    } catch (err) {
      console.error('❌ [eventsApi.getByCampus] Exception:', err)
      throw err
    }
  }
}

// =============================================================================
// TICKETS API
// =============================================================================
export const ticketsApi = {
  getAll: async (filters?: {
    campusId?: string
    sellerId?: string
    status?: string
    search?: string
  }): Promise<Ticket[]> => {
    console.log('🔍 [ticketsApi.getAll] Fetching tickets...', filters)
    
    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_seller_id_fkey (
            name,
            avatar,
            university,
            reputation_score,
            successful_sales,
            snapchat_handle,
            instagram_handle,
            phone_number
          ),
          campuses (
            name,
            domain
          )
        `)
        .order('created_at', { ascending: false })
      
      if (filters?.campusId) {
        query = query.eq('campus_id', filters.campusId)
      }
      if (filters?.sellerId) {
        query = query.eq('seller_id', filters.sellerId)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      } else {
        query = query.eq('status', 'active')
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,event_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('❌ [ticketsApi.getAll] Error:', error)
        throw error
      }
      
      console.log('✅ [ticketsApi.getAll] Success:', data?.length || 0, 'tickets')
      return (data || []) as Ticket[]
    } catch (err) {
      console.error('❌ [ticketsApi.getAll] Exception:', err)
      throw err
    }
  },

  getById: async (id: string): Promise<Ticket | null> => {
    console.log('🔍 [ticketsApi.getById] Fetching ticket:', id)
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          users!tickets_seller_id_fkey (
            name,
            avatar,
            university,
            reputation_score,
            successful_sales,
            snapchat_handle,
            instagram_handle,
            phone_number
          ),
          campuses (
            name,
            domain
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('❌ [ticketsApi.getById] Error:', error)
        throw error
      }
      
      // Increment view count
      await supabase
        .from('tickets')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
      
      console.log('✅ [ticketsApi.getById] Success')
      return data as Ticket
    } catch (err) {
      console.error('❌ [ticketsApi.getById] Exception:', err)
      throw err
    }
  },

  create: async (ticketData: Omit<TicketInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> => {
    console.log('🔍 [ticketsApi.create] Creating ticket...', ticketData.title)
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          status: 'active',
          views: 0,
          quantity_sold: 0
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ [ticketsApi.create] Error:', error)
        throw error
      }
      
      console.log('✅ [ticketsApi.create] Success')
      return data
    } catch (err) {
      console.error('❌ [ticketsApi.create] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    console.log('🔍 [ticketsApi.update] Updating ticket:', id)
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [ticketsApi.update] Error:', error)
        throw error
      }
      
      console.log('✅ [ticketsApi.update] Success')
      return data
    } catch (err) {
      console.error('❌ [ticketsApi.update] Exception:', err)
      throw err
    }
  },

  markSold: async (ticketId: string, quantity?: number): Promise<void> => {
    console.log('🔍 [ticketsApi.markSold] Marking ticket sold:', ticketId)
    
    try {
      const { error } = await supabase.rpc('mark_ticket_sold', {
        ticket_id: ticketId,
        quantity_to_mark: quantity
      })
      
      if (error) {
        console.error('❌ [ticketsApi.markSold] Error:', error)
        throw error
      }
      
      console.log('✅ [ticketsApi.markSold] Success')
    } catch (err) {
      console.error('❌ [ticketsApi.markSold] Exception:', err)
      throw err
    }
  },

  delete: async (id: string): Promise<void> => {
    console.log('🔍 [ticketsApi.delete] Deleting ticket:', id)
    
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ [ticketsApi.delete] Error:', error)
        throw error
      }
      
      console.log('✅ [ticketsApi.delete] Success')
    } catch (err) {
      console.error('❌ [ticketsApi.delete] Exception:', err)
      throw err
    }
  }
}

// =============================================================================
// REPORTS API
// =============================================================================
export const reportsApi = {
  create: async (reportData: Omit<ReportInsert, 'id' | 'created_at'>): Promise<Report> => {
    console.log('🔍 [reportsApi.create] Creating report...', reportData.reason)
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...reportData,
          status: 'pending'
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ [reportsApi.create] Error:', error)
        throw error
      }
      
      console.log('✅ [reportsApi.create] Success')
      return data
    } catch (err) {
      console.error('❌ [reportsApi.create] Exception:', err)
      throw err
    }
  },

  getAll: async (status?: string): Promise<Report[]> => {
    console.log('🔍 [reportsApi.getAll] Fetching reports...')
    
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('❌ [reportsApi.getAll] Error:', error)
        throw error
      }
      
      console.log('✅ [reportsApi.getAll] Success:', data?.length || 0, 'reports')
      return data || []
    } catch (err) {
      console.error('❌ [reportsApi.getAll] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Report>): Promise<Report> => {
    console.log('🔍 [reportsApi.update] Updating report:', id)
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [reportsApi.update] Error:', error)
        throw error
      }
      
      console.log('✅ [reportsApi.update] Success')
      return data
    } catch (err) {
      console.error('❌ [reportsApi.update] Exception:', err)
      throw err
    }
  }
}

// =============================================================================
// SAVED TICKETS API
// =============================================================================
export const savedTicketsApi = {
  getSaved: async (userId: string): Promise<Ticket[]> => {
    console.log('🔍 [savedTicketsApi.getSaved] Fetching saved tickets for user:', userId)
    
    try {
      const { data, error } = await supabase
        .from('saved_tickets')
        .select(`
          ticket_id,
          tickets (
            *,
            users!tickets_seller_id_fkey (
              name,
              avatar,
              university,
              reputation_score,
              successful_sales
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ [savedTicketsApi.getSaved] Error:', error)
        throw error
      }
      
      // Extract tickets from the join
      const tickets = data?.map((item: any) => item.tickets).filter(Boolean) || []
      
      console.log('✅ [savedTicketsApi.getSaved] Success:', tickets.length, 'tickets')
      return tickets as Ticket[]
    } catch (err) {
      console.error('❌ [savedTicketsApi.getSaved] Exception:', err)
      throw err
    }
  },

  save: async (userId: string, ticketId: string): Promise<void> => {
    console.log('🔍 [savedTicketsApi.save] Saving ticket...', ticketId)
    
    try {
      const { error } = await supabase
        .from('saved_tickets')
        .insert({
          user_id: userId,
          ticket_id: ticketId
        })
      
      if (error) {
        console.error('❌ [savedTicketsApi.save] Error:', error)
        throw error
      }
      
      console.log('✅ [savedTicketsApi.save] Success')
    } catch (err) {
      console.error('❌ [savedTicketsApi.save] Exception:', err)
      throw err
    }
  },

  unsave: async (userId: string, ticketId: string): Promise<void> => {
    console.log('🔍 [savedTicketsApi.unsave] Unsaving ticket...', ticketId)
    
    try {
      const { error } = await supabase
        .from('saved_tickets')
        .delete()
        .eq('user_id', userId)
        .eq('ticket_id', ticketId)
      
      if (error) {
        console.error('❌ [savedTicketsApi.unsave] Error:', error)
        throw error
      }
      
      console.log('✅ [savedTicketsApi.unsave] Success')
    } catch (err) {
      console.error('❌ [savedTicketsApi.unsave] Exception:', err)
      throw err
    }
  }
}

// Legacy exports for compatibility (will be removed)
export const postsApi = ticketsApi
export const messagesApi = {}
export const ridesApi = {}

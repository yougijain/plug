// Campus Connect API
import { supabase } from './supabase'
import type { Campus, User, Ticket, Event, Report, TicketInsert, ReportInsert, EventInsert } from '../types'

// =============================================================================
// CAMPUSES API
// =============================================================================
export const campusesApi = {
  getAll: async (): Promise<Campus[]> => {
    try {
      const { data, error } = await supabase
        .from('campuses')
        .select('*')
        .eq('is_active', true as any)
        .order('name')
      
      if (error) {
        console.error('Failed to fetch campuses:', error.message)
        throw error
      }
      
      return (data || []) as unknown as Campus[]
    } catch (err) {
      console.error('Campuses fetch exception:', err)
      throw err
    }
  },

  getByDomain: async (domain: string): Promise<Campus | null> => {
    try {
      const { data, error } = await supabase
        .from('campuses')
        .select('*')
        .eq('domain', domain.toLowerCase() as any)
        .eq('is_active', true as any)
        .maybeSingle()
      
      if (error) {
        console.error('Failed to fetch campus by domain:', error.message)
        throw error
      }
      
      return data as unknown as Campus | null
    } catch (err) {
      console.error('Campus fetch exception:', err)
      throw err
    }
  }
}

// =============================================================================
// USERS API
// =============================================================================
export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError.message)
        throw authError
      }
      
      if (!user) {
        return null
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id as any)
        .maybeSingle()
      
      if (error) {
        // Treat "no rows" as null (profile not created yet)
        if ((error as any)?.code === 'PGRST116' || error.message?.toLowerCase().includes('no rows')) {
          return null
        }
        console.error('Failed to fetch user:', error.message)
        throw error
      }
      
      return data ? (data as unknown as User) : null
    } catch (err) {
      console.error('Get current user exception:', err)
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
        } as any, { onConflict: 'id' })
        .select()
        .single()
      
      if (error) {
        console.error('Failed to create user:', error.message)
        throw error
      }
      
      return data as unknown as User
    } catch (err) {
      console.error('Create user exception:', err)
      throw err
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates as any)
        .eq('id', userId as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to update profile:', error.message)
        throw error
      }
      
      return data as unknown as User
    } catch (err) {
      console.error('Update profile exception:', err)
      throw err
    }
  },

  deleteAccount: async (userId: string): Promise<void> => {
    try {
      // First, delete all user's tickets
      await supabase.from('tickets').delete().eq('seller_id', userId as any)
      
      // Delete saved tickets
      await supabase.from('saved_tickets').delete().eq('user_id', userId as any)
      
      // Delete reports
      await supabase.from('reports').delete().eq('reporter_id', userId as any)
      
      // Delete reputation records
      await supabase.from('reputation').delete().eq('user_id', userId as any)
      
      // Finally, delete user
      const { error } = await supabase.from('users').delete().eq('id', userId as any)
      
      if (error) {
        console.error('Failed to delete account:', error.message)
        throw error
      }
      
      // Delete auth user
      await supabase.auth.admin.deleteUser(userId)
    } catch (err) {
      console.error('Delete account exception:', err)
      throw err
    }
  },

  getById: async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId as any)
        .single()
      
      if (error) {
        console.error('Failed to fetch user:', error.message)
        throw error
      }
      
      return data as unknown as User | null
    } catch (err) {
      console.error('Get user by ID exception:', err)
      throw err
    }
  }
}

// =============================================================================
// EVENTS API
// =============================================================================
export const eventsApi = {
  create: async (eventData: Omit<EventInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to create event:', error.message)
        throw error
      }
      
      return data as unknown as Event
    } catch (err) {
      console.error('Create event exception:', err)
      throw err
    }
  },

  getByCampus: async (campusId: string): Promise<Event[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('campus_id', campusId as any)
        .gte('event_date', new Date().toISOString())
        .order('event_date')
      
      if (error) {
        console.error('Failed to fetch events:', error.message)
        throw error
      }
      
      return (data || []) as unknown as Event[]
    } catch (err) {
      console.error('Get events by campus exception:', err)
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
        query = query.eq('campus_id', filters.campusId as any)
      }
      if (filters?.sellerId) {
        query = query.eq('seller_id', filters.sellerId as any)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status as any)
      } else {
        query = query.eq('status', 'active' as any)
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,event_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Failed to fetch tickets:', error.message)
        throw error
      }
      
      return (data || []) as unknown as Ticket[]
    } catch (err) {
      console.error('Get tickets exception:', err)
      throw err
    }
  },

  getById: async (id: string): Promise<Ticket | null> => {
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
        .eq('id', id as any)
        .single()
      
      if (error) {
        console.error('Failed to fetch ticket:', error.message)
        throw error
      }
      
      // Increment view count
      const ticketData = data as any
      await supabase
        .from('tickets')
        .update({ views: (ticketData.views || 0) + 1 } as any)
        .eq('id', id as any)
      
      return data as unknown as Ticket
    } catch (err) {
      console.error('Get ticket by ID exception:', err)
      throw err
    }
  },

  create: async (ticketData: Omit<TicketInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          status: 'active',
          views: 0,
          quantity_sold: 0
        } as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to create ticket:', error.message)
        throw error
      }
      
      return data as unknown as Ticket
    } catch (err) {
      console.error('Create ticket exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates as any)
        .eq('id', id as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to update ticket:', error.message)
        throw error
      }
      
      return data as unknown as Ticket
    } catch (err) {
      console.error('Update ticket exception:', err)
      throw err
    }
  },

  markSold: async (ticketId: string, quantity?: number): Promise<void> => {
    try {
      const { error } = await supabase.rpc('mark_ticket_sold', {
        ticket_id: ticketId,
        quantity_to_mark: quantity
      })
      
      if (error) {
        console.error('Failed to mark ticket sold:', error.message)
        throw error
      }
    } catch (err) {
      console.error('Mark ticket sold exception:', err)
      throw err
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id as any)
      
      if (error) {
        console.error('Failed to delete ticket:', error.message)
        throw error
      }
    } catch (err) {
      console.error('Delete ticket exception:', err)
      throw err
    }
  }
}

// =============================================================================
// REPORTS API
// =============================================================================
export const reportsApi = {
  create: async (reportData: Omit<ReportInsert, 'id' | 'created_at'>): Promise<Report> => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...reportData,
          status: 'pending'
        } as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to create report:', error.message)
        throw error
      }
      
      return data as unknown as Report
    } catch (err) {
      console.error('Create report exception:', err)
      throw err
    }
  },

  getAll: async (status?: string): Promise<Report[]> => {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (status) {
        query = query.eq('status', status as any)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Failed to fetch reports:', error.message)
        throw error
      }
      
      return (data || []) as unknown as Report[]
    } catch (err) {
      console.error('Get reports exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Report>): Promise<Report> => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates as any)
        .eq('id', id as any)
        .select()
        .single()
      
      if (error) {
        console.error('Failed to update report:', error.message)
        throw error
      }
      
      return data as unknown as Report
    } catch (err) {
      console.error('Update report exception:', err)
      throw err
    }
  }
}

// =============================================================================
// SAVED TICKETS API
// =============================================================================
export const savedTicketsApi = {
  getSaved: async (userId: string): Promise<Ticket[]> => {
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
        .eq('user_id', userId as any)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Failed to fetch saved tickets:', error.message)
        throw error
      }
      
      // Extract tickets from the join
      const tickets = data?.map((item: any) => item.tickets).filter(Boolean) || []
      
      return tickets as unknown as Ticket[]
    } catch (err) {
      console.error('Get saved tickets exception:', err)
      throw err
    }
  },

  save: async (userId: string, ticketId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('saved_tickets')
        .insert({
          user_id: userId,
          ticket_id: ticketId
        } as any)
      
      if (error) {
        console.error('Failed to save ticket:', error.message)
        throw error
      }
    } catch (err) {
      console.error('Save ticket exception:', err)
      throw err
    }
  },

  unsave: async (userId: string, ticketId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('saved_tickets')
        .delete()
        .eq('user_id', userId as any)
        .eq('ticket_id', ticketId as any)
      
      if (error) {
        console.error('Failed to unsave ticket:', error.message)
        throw error
      }
    } catch (err) {
      console.error('Unsave ticket exception:', err)
      throw err
    }
  }
}

// Legacy exports for compatibility (will be removed)
export const postsApi = ticketsApi
export const messagesApi = {}
export const ridesApi = {}

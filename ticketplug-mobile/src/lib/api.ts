// TicketPlug API
import { supabase } from './supabase'
import type { Campus, User, Ticket, Event, Report, TicketInsert, ReportInsert, EventInsert } from '../types'

export const campusesApi = {
  getAll: async (): Promise<Campus[]> => {
    if (!supabase) {
      console.warn('Supabase not configured')
      return []
    }
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
    if (!supabase) {
      return null
    }
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

export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    if (!supabase) {
      return null
    }
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
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    try {
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
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    try {
      const client = supabase as any
      const { data, error } = await client
        .from('users')
        .update(updates)
        .eq('id', userId)
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
  }
}

export const ticketsApi = {
  getAll: async (filters?: {
    campusId?: string
    sellerId?: string
    status?: string
    search?: string
  }): Promise<Ticket[]> => {
    if (!supabase) {
      return []
    }
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
    if (!supabase) {
      return null
    }
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
      
      const ticketData = data as any
      const client = supabase as any
      await client
        .from('tickets')
        .update({ views: (ticketData.views || 0) + 1 })
        .eq('id', id)
      
      return data as unknown as Ticket
    } catch (err) {
      console.error('Get ticket by ID exception:', err)
      throw err
    }
  },

  create: async (ticketData: Omit<TicketInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
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
  }
}

export const savedTicketsApi = {
  getSaved: async (userId: string): Promise<Ticket[]> => {
    if (!supabase) {
      return []
    }
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
      
      const tickets = data?.map((item: any) => item.tickets).filter(Boolean) || []
      return tickets as unknown as Ticket[]
    } catch (err) {
      console.error('Get saved tickets exception:', err)
      throw err
    }
  },

  save: async (userId: string, ticketId: string): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
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
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
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


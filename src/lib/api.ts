import { supabase } from './supabase'
import type { Database } from '../types/database'
import { isDemoMode } from './env'
import { log, logError, warn } from './logger'
import {
  demoConnectionCheck,
  demoMessagesApi,
  demoPostsApi,
  demoRidesApi,
  demoUserApi,
} from './demo/backend'

/**
 * Data access layer.
 *
 * Each API object below is implemented twice: once against Supabase, once
 * against the in-browser demo backend. The exports at the bottom of the file
 * pick one at startup, so hooks and pages never branch on which is live.
 */

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Post = Tables['posts']['Row']
type Message = Tables['messages']['Row']
type Ride = Tables['rides']['Row']
type Conversation = Tables['conversations']['Row']

// User API
const supabaseUserApi = {
  getCurrentUser: async (): Promise<User | null> => {
    log('[userApi.getCurrentUser] Starting...')
    
    try {
      log('[userApi.getCurrentUser] Getting auth user...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        logError('[userApi.getCurrentUser] Auth error:', authError)
        throw authError
      }
      
      if (!user) {
        log('[userApi.getCurrentUser] No auth user found')
        return null
      }
      
      log('[userApi.getCurrentUser] Auth user found:', user.id)
      log('[userApi.getCurrentUser] Querying users table...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        logError('[userApi.getCurrentUser] Database error:', error)
        throw error
      }
      
      log('[userApi.getCurrentUser] Success:', data)
      return data
    } catch (err) {
      logError('[userApi.getCurrentUser] Exception:', err)
      throw err
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    log('[userApi.updateProfile] Starting...', { userId, updates })
    
    try {
      log('[userApi.updateProfile] Updating user in database...')
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        logError('[userApi.updateProfile] Database error:', error)
        throw error
      }
      
      log('[userApi.updateProfile] Success:', data)
      return data
    } catch (err) {
      logError('[userApi.updateProfile] Exception:', err)
      throw err
    }
  },

  /** Batch profile lookup, used to label conversations with real names. */
  getByIds: async (ids: string[]): Promise<User[]> => {
    if (ids.length === 0) return []
    const { data, error } = await supabase.from('users').select('*').in('id', ids)
    if (error) {
      logError('[userApi.getByIds] Database error:', error)
      throw error
    }
    return (data || []) as User[]
  },

  createUser: async (
    params: { id: string } & Omit<User, 'id' | 'created_at' | 'updated_at'>
  ) => {
    log('[userApi.createUser] Starting...', params)
    
    try {
      log('[userApi.createUser] Inserting user into database...')
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: params.id,
          email: params.email,
          name: params.name,
          university: params.university,
          avatar: params.avatar,
          verified: params.verified ?? false,
        }, { onConflict: 'id' })
        .select()
        .single()
      
      if (error) {
        logError('[userApi.createUser] Database error:', error)
        throw error
      }
      
      log('[userApi.createUser] Success:', data)
      return data
    } catch (err) {
      logError('[userApi.createUser] Exception:', err)
      throw err
    }
  }
}

// Posts API
const supabasePostsApi = {
  getAll: async (filters?: {
    type?: string
    category?: string
    status?: string
    userId?: string
    isFlash?: boolean
  }): Promise<Post[]> => {
    log('[postsApi.getAll] Starting...', filters)
    
    try {
      log('[postsApi.getAll] Building query...')
      let query = supabase
        .from('posts')
        .select(`
          *,
          users (
            name,
            avatar,
            university
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (typeof filters?.isFlash === 'boolean') {
        query = query.eq('is_flash_deal', filters.isFlash)
      }
      
      log('[postsApi.getAll] Executing query...')
      const { data, error } = await query
      
      if (error) {
        logError('[postsApi.getAll] Database error:', error)
        throw error
      }
      
      log('[postsApi.getAll] Success:', data?.length || 0, 'posts')
      return (data || []) as Post[]
    } catch (err) {
      logError('[postsApi.getAll] Exception:', err)
      throw err
    }
  },

  getById: async (id: string): Promise<Post | null> => {
    log('[postsApi.getById] Starting...', id)
    
    try {
      log('[postsApi.getById] Querying post...')
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (
            name,
            avatar,
            university
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        logError('[postsApi.getById] Database error:', error)
        throw error
      }
      
      log('[postsApi.getById] Success:', data)
      return data as Post
    } catch (err) {
      logError('[postsApi.getById] Exception:', err)
      throw err
    }
  },

  create: async (postData: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
    log('[postsApi.create] Starting...', postData)
    
    try {
      // Ensure the posting user exists in public.users to satisfy RLS
      log('[postsApi.create] Ensuring user row exists for', postData.user_id)
      const { data: existingUser, error: userSelectError } = await supabase
        .from('users')
        .select('id')
        .eq('id', postData.user_id)
        .maybeSingle()

      if (userSelectError) {
        warn('[postsApi.create] user lookup error (continuing to upsert):', userSelectError)
      }

      if (!existingUser) {
        log('[postsApi.create] No user row found; attempting upsert from auth metadata')
        const { data: authData } = await supabase.auth.getUser()
        const authUser = authData?.user as any
        const fallbackEmail = authUser?.email || 'user@example.com'
        const fallbackName = authUser?.user_metadata?.name || (fallbackEmail.split('@')[0] || 'User')
        const fallbackUniversity = authUser?.user_metadata?.university || ''
        const fallbackAvatar = authUser?.user_metadata?.avatar

        const { error: upsertErr } = await supabase
          .from('users')
          .upsert({
            id: postData.user_id,
            email: fallbackEmail,
            name: fallbackName,
            university: fallbackUniversity,
            avatar: fallbackAvatar,
            verified: false
          }, { onConflict: 'id' })
        if (upsertErr) {
          logError('[postsApi.create] Failed to upsert user before posting:', upsertErr)
          throw upsertErr
        }
        log('[postsApi.create] User row ensured')
      }

      log('[postsApi.create] Creating post...')
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: postData.user_id,
          type: postData.type,
          title: postData.title,
          description: postData.description,
          price: postData.price,
          category: postData.category,
          location: postData.location,
          images: postData.images,
          expires_at: postData.expires_at,
          status: 'active',
          tags: postData.tags || [],
          is_flash_deal: postData.is_flash_deal || false,
          flash_deal_expires_at: postData.flash_deal_expires_at
        })
        .select()
        .single()
      
      if (error) {
        logError('[postsApi.create] Database error:', error)
        throw error
      }
      
      log('[postsApi.create] Success:', data)
      return data
    } catch (err) {
      logError('[postsApi.create] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Post>): Promise<Post> => {
    log('[postsApi.update] Starting...', { id, updates })
    
    try {
      log('[postsApi.update] Updating post...')
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        logError('[postsApi.update] Database error:', error)
        throw error
      }
      
      log('[postsApi.update] Success:', data)
      return data
    } catch (err) {
      logError('[postsApi.update] Exception:', err)
      throw err
    }
  },

  delete: async (id: string): Promise<void> => {
    log('[postsApi.delete] Starting...', id)
    
    try {
      log('[postsApi.delete] Deleting post...')
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        logError('[postsApi.delete] Database error:', error)
        throw error
      }
      
      log('[postsApi.delete] Success')
    } catch (err) {
      logError('[postsApi.delete] Exception:', err)
      throw err
    }
  }
}

// Messages API
const supabaseMessagesApi = {
  getConversations: async (userId: string): Promise<Conversation[]> => {
    log('[messagesApi.getConversations] Starting...', userId)
    
    try {
      log('[messagesApi.getConversations] Querying conversations...')
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [userId])
        .order('updated_at', { ascending: false })
      
      if (error) {
        logError('[messagesApi.getConversations] Database error:', error)
        throw error
      }
      
      log('[messagesApi.getConversations] Success:', data?.length || 0, 'conversations')
      
      // If no real conversations exist, return mock ones for testing
      if (!data || data.length === 0) {
        log('[messagesApi.getConversations] No real conversations found, returning mock ones')
        return [
          {
            id: 'conv1',
            participants: [userId, 'user2'],
            last_message_id: 'msg1',
            unread_count: 2,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'conv2',
            participants: [userId, 'user3'],
            last_message_id: 'msg3',
            unread_count: 0,
            created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          }
        ]
      }
      
      return data || []
    } catch (err) {
      logError('[messagesApi.getConversations] Exception:', err)
      throw err
    }
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    log('[messagesApi.getMessages] Starting...', conversationId)
    
    try {
      log('[messagesApi.getMessages] Querying messages...')
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (error) {
        logError('[messagesApi.getMessages] Database error:', error)
        throw error
      }
      
      log('[messagesApi.getMessages] Success:', data?.length || 0, 'messages')
      
      // If no real messages exist, return mock ones for testing
      if (!data || data.length === 0) {
        log('[messagesApi.getMessages] No real messages found, returning mock ones')
        
        // Get the conversation to find the current user ID
        const { data: conversationData, error: convError } = await supabase
          .from('conversations')
          .select('participants')
          .eq('id', conversationId)
          .single()
        
        if (convError) {
          logError('[messagesApi.getMessages] Failed to get conversation:', convError)
          return []
        }
        
        // Get the current user ID from auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          logError('[messagesApi.getMessages] Failed to get current user:', authError)
          return []
        }
        
        const currentUserId = user.id
        const otherUserId = conversationData.participants.find((id: string) => id !== currentUserId) || 'user2'
        
        log('[messagesApi.getMessages] Using user IDs:', { currentUserId, otherUserId })
        
        return [
          {
            id: 'msg1',
            sender_id: otherUserId,
            receiver_id: currentUserId,
            conversation_id: conversationId,
            content: 'Hey! I saw your post about the iPhone. Is it still available?',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
          },
          {
            id: 'msg2',
            sender_id: currentUserId,
            receiver_id: otherUserId,
            conversation_id: conversationId,
            content: 'Yes, it is! Are you interested?',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: 'msg3',
            sender_id: otherUserId,
            receiver_id: currentUserId,
            conversation_id: conversationId,
            content: 'Great! Can we meet on campus tomorrow?',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false,
          }
        ]
      }
      
      return data || []
    } catch (err) {
      logError('[messagesApi.getMessages] Exception:', err)
      throw err
    }
  },

  sendMessage: async (messageData: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
    log('[messagesApi.sendMessage] Starting...', messageData)
    
    try {
      log('[messagesApi.sendMessage] Sending message...')
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: messageData.sender_id,
          receiver_id: messageData.receiver_id,
          conversation_id: messageData.conversation_id,
          content: messageData.content,
          read: messageData.read || false,
        })
        .select()
        .single()
      
      if (error) {
        logError('[messagesApi.sendMessage] Database error:', error)
        throw error
      }
      
      log('[messagesApi.sendMessage] Success:', data)
      return data
    } catch (err) {
      logError('[messagesApi.sendMessage] Exception:', err)
      throw err
    }
  },

  markAsRead: async (messageId: string) => {
    log('[messagesApi.markAsRead] Starting...', { messageId })
    
    try {
      log('[messagesApi.markAsRead] Updating message...')
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
      
      if (error) {
        logError('[messagesApi.markAsRead] Database error:', error)
        throw error
      }
      
      log('[messagesApi.markAsRead] Success')
    } catch (err) {
      logError('[messagesApi.markAsRead] Exception:', err)
      throw err
    }
  },

  getOrCreateConversation: async (participants: string[]): Promise<Conversation> => {
    log('[messagesApi.getOrCreateConversation] Starting...', participants)
    
    try {
      log('[messagesApi.getOrCreateConversation] Looking for existing conversation...')
      const { data: existing, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', participants)
        .single()
      
      if (existing && !searchError) {
        log('[messagesApi.getOrCreateConversation] Found existing conversation:', existing)
        return existing
      }
      
      log('[messagesApi.getOrCreateConversation] Creating new conversation...')
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participants,
          unread_count: 0,
        })
        .select()
        .single()
      
      if (createError) {
        logError('[messagesApi.getOrCreateConversation] Create error:', createError)
        throw createError
      }
      
      log('[messagesApi.getOrCreateConversation] Created new conversation:', newConv)
      return newConv
    } catch (err) {
      logError('[messagesApi.getOrCreateConversation] Exception:', err)
      throw err
    }
  }
}

// Rides API
const supabaseRidesApi = {
  getAll: async (filters?: {
    status?: string
    driverId?: string
  }) => {
    log('[ridesApi.getAll] Starting...', { filters })
    
    try {
      log('[ridesApi.getAll] Building query...')
      let query = supabase.from('rides').select('*')
      
      if (filters?.status) {
        log('[ridesApi.getAll] Adding status filter:', filters.status)
        query = query.eq('status', filters.status)
      }
      if (filters?.driverId) {
        log('[ridesApi.getAll] Adding driverId filter:', filters.driverId)
        query = query.eq('driver_id', filters.driverId)
      }
      
      log('[ridesApi.getAll] Executing query...')
      const { data, error } = await query.order('departure_time', { ascending: true })
      
      if (error) {
        logError('[ridesApi.getAll] Database error:', error)
        throw error
      }
      
      log('[ridesApi.getAll] Success:', data?.length || 0, 'rides')
      return data
    } catch (err) {
      logError('[ridesApi.getAll] Exception:', err)
      throw err
    }
  },

  create: async (rideData: Omit<Ride, 'id' | 'created_at'>) => {
    log('[ridesApi.create] Starting...', rideData)
    
    try {
      log('[ridesApi.create] Inserting into database...')
      const { data, error } = await supabase
        .from('rides')
        .insert(rideData)
        .select()
        .single()
      
      if (error) {
        logError('[ridesApi.create] Database error:', error)
        throw error
      }
      
      log('[ridesApi.create] Success:', data)
      return data
    } catch (err) {
      logError('[ridesApi.create] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Ride>) => {
    log('[ridesApi.update] Starting...', { id, updates })
    
    try {
      log('[ridesApi.update] Updating in database...')
      const { data, error } = await supabase
        .from('rides')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        logError('[ridesApi.update] Database error:', error)
        throw error
      }
      
      log('[ridesApi.update] Success:', data)
      return data
    } catch (err) {
      logError('[ridesApi.update] Exception:', err)
      throw err
    }
  }
} 

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  log('[testSupabaseConnection] Starting connection test...')
  
  try {
    log('[testSupabaseConnection] Testing basic query...')
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      logError('[testSupabaseConnection] Connection failed:', error)
      return false
    }
    
    log('[testSupabaseConnection] Connection successful!')
    return true
  } catch (err) {
    logError('[testSupabaseConnection] Connection error:', err)
    return false
  }
}

// Comprehensive database inspection function
export const inspectDatabase = async () => {
  log('[inspectDatabase] Starting comprehensive database inspection...')
  
  try {
    // Check if tables exist and get their structure
    const tables = ['users', 'posts', 'conversations', 'messages', 'rides']
    
    for (const tableName of tables) {
      try {
        log(`[inspectDatabase] Checking table: ${tableName}`)
        
        // Try to select from the table
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          logError(`[inspectDatabase] Table ${tableName} error:`, error)
        } else {
          log(`[inspectDatabase] Table ${tableName} exists and accessible`)
          
          // If we got data, show the structure
          if (data && data.length > 0) {
            log(`[inspectDatabase] Sample row structure:`, Object.keys(data[0]))
          }
        }
      } catch (err) {
        logError(`[inspectDatabase] Failed to check table ${tableName}:`, err)
      }
    }
    
    // Test specific schema requirements
    log('[inspectDatabase] Testing specific schema requirements...')
    
    // Test conversations.participants as TEXT[]
    try {
      log('[inspectDatabase] Testing conversations.participants...')
      const { data, error } = await supabase
        .from('conversations')
        .select('participants')
        .limit(1)
      
      if (error) {
        logError('[inspectDatabase] conversations.participants test failed:', error)
      } else {
        log('[inspectDatabase] conversations.participants is accessible')
        if (data && data.length > 0) {
          log('[inspectDatabase] participants type:', typeof data[0].participants, Array.isArray(data[0].participants))
        }
      }
    } catch (err) {
      logError('[inspectDatabase] conversations.participants test error:', err)
    }
    
    // Test posts schema
    try {
      log('[inspectDatabase] Testing posts schema...')
      const { data, error } = await supabase
        .from('posts')
        .select('user_id, type, title, is_flash_deal, flash_deal_expires_at')
        .limit(1)
      
      if (error) {
        logError('[inspectDatabase] posts schema test failed:', error)
      } else {
        log('[inspectDatabase] posts schema is accessible')
        if (data && data.length > 0) {
          log('[inspectDatabase] posts sample fields:', Object.keys(data[0]))
        }
      }
    } catch (err) {
      logError('[inspectDatabase] posts schema test error:', err)
    }
    
    // Test messages schema
    try {
      log('[inspectDatabase] Testing messages schema...')
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, conversation_id, read')
        .limit(1)
      
      if (error) {
        logError('[inspectDatabase] messages schema test failed:', error)
      } else {
        log('[inspectDatabase] messages schema is accessible')
        if (data && data.length > 0) {
          log('[inspectDatabase] messages sample fields:', Object.keys(data[0]))
        }
      }
    } catch (err) {
      logError('[inspectDatabase] messages schema test error:', err)
    }
    
    log('[inspectDatabase] Database inspection complete!')
    return true
    
  } catch (err) {
    logError('[inspectDatabase] Database inspection failed:', err)
    return false
  }
} 
/* ------------------------------------------------- backend selection ------ */

/**
 * The live backend. Demo mode is chosen when no Supabase credentials are
 * present (see `src/lib/env.ts`), which is what keeps the public deployment
 * explorable with no database behind it.
 */
export const userApi = isDemoMode ? demoUserApi : supabaseUserApi
export const postsApi = isDemoMode ? demoPostsApi : supabasePostsApi
export const messagesApi = isDemoMode ? demoMessagesApi : supabaseMessagesApi
export const ridesApi = isDemoMode ? demoRidesApi : supabaseRidesApi

/** Startup health check for whichever backend is live. */
export const checkBackend = async () => {
  if (isDemoMode) return demoConnectionCheck()

  try {
    const { error } = await supabase.from('posts').select('id').limit(1)
    if (error) {
      return { success: false as const, mode: 'supabase' as const, message: error.message }
    }
    return { success: true as const, mode: 'supabase' as const, message: 'Supabase reachable.' }
  } catch (err) {
    return {
      success: false as const,
      mode: 'supabase' as const,
      message: err instanceof Error ? err.message : 'Unknown Supabase error.',
    }
  }
}

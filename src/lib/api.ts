import { supabase } from './supabase'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Post = Tables['posts']['Row']
type Message = Tables['messages']['Row']
type Ride = Tables['rides']['Row']
type Conversation = Tables['conversations']['Row']

// Check if we're in demo mode
const isDemoMode = !process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY

// Demo data for testing
const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  university: 'Purdue University',
  avatar: undefined,
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const DEMO_POSTS: Post[] = [
  {
    id: '1',
    user_id: 'demo-user-1',
    type: 'item',
    title: 'iPhone 13 Pro',
    description: 'Perfect condition, 128GB, comes with case and charger.',
    price: 800,
    category: 'Electronics',
    location: 'Purdue Campus',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    tags: ['iphone', 'electronics', 'phone'],
  },
  {
    id: '2',
    user_id: 'demo-user-1',
    type: 'service',
    title: 'Math Tutoring',
    description: 'Calculus and linear algebra tutoring. $20/hour.',
    price: 20,
    category: 'Education',
    location: 'Indiana University Campus',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    tags: ['tutoring', 'math', 'education'],
  },
]

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    console.log('🔍 [userApi.getCurrentUser] Starting...')
    console.log('🔍 [userApi.getCurrentUser] isDemoMode:', isDemoMode)
    
    if (isDemoMode) {
      console.log('🔍 [userApi.getCurrentUser] Returning demo user')
      return DEMO_USER
    }
    
    try {
      console.log('🔍 [userApi.getCurrentUser] Getting auth user...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ [userApi.getCurrentUser] Auth error:', authError)
        throw authError
      }
      
      if (!user) {
        console.log('🔍 [userApi.getCurrentUser] No auth user found')
        return null
      }
      
      console.log('🔍 [userApi.getCurrentUser] Auth user found:', user.id)
      console.log('🔍 [userApi.getCurrentUser] Querying users table...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('❌ [userApi.getCurrentUser] Database error:', error)
        throw error
      }
      
      console.log('✅ [userApi.getCurrentUser] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [userApi.getCurrentUser] Exception:', err)
      throw err
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    console.log('🔍 [userApi.updateProfile] Starting...', { userId, updates })
    
    if (isDemoMode) {
      console.log('🔍 [userApi.updateProfile] Returning demo user with updates')
      return { ...DEMO_USER, ...updates }
    }
    
    try {
      console.log('🔍 [userApi.updateProfile] Updating user in database...')
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [userApi.updateProfile] Database error:', error)
        throw error
      }
      
      console.log('✅ [userApi.updateProfile] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [userApi.updateProfile] Exception:', err)
      throw err
    }
  },

  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('🔍 [userApi.createUser] Starting...', userData)
    
    if (isDemoMode) {
      console.log('🔍 [userApi.createUser] Returning demo user')
      return { ...userData, id: 'demo-user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    }
    
    try {
      console.log('🔍 [userApi.createUser] Inserting user into database...')
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [userApi.createUser] Database error:', error)
        throw error
      }
      
      console.log('✅ [userApi.createUser] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [userApi.createUser] Exception:', err)
      throw err
    }
  }
}

// Posts API
export const postsApi = {
  getAll: async (filters?: {
    type?: string
    category?: string
    status?: string
    userId?: string
  }): Promise<Post[]> => {
    console.log('🔍 [postsApi.getAll] Starting...', filters)
    
    if (isDemoMode) {
      console.log('🔍 [postsApi.getAll] Demo mode - returning demo posts')
      return DEMO_POSTS
    }
    
    try {
      console.log('🔍 [postsApi.getAll] Building query...')
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
      
      console.log('🔍 [postsApi.getAll] Executing query...')
      const { data, error } = await query
      
      if (error) {
        console.error('❌ [postsApi.getAll] Database error:', error)
        throw error
      }
      
      console.log('✅ [postsApi.getAll] Success:', data?.length || 0, 'posts')
      return (data || []) as Post[]
    } catch (err) {
      console.error('❌ [postsApi.getAll] Exception:', err)
      throw err
    }
  },

  getById: async (id: string): Promise<Post | null> => {
    console.log('🔍 [postsApi.getById] Starting...', id)
    
    if (isDemoMode) {
      console.log('🔍 [postsApi.getById] Demo mode - returning demo post')
      return DEMO_POSTS.find(post => post.id === id) || null
    }
    
    try {
      console.log('🔍 [postsApi.getById] Querying post...')
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
        console.error('❌ [postsApi.getById] Database error:', error)
        throw error
      }
      
      console.log('✅ [postsApi.getById] Success:', data)
      return data as Post
    } catch (err) {
      console.error('❌ [postsApi.getById] Exception:', err)
      throw err
    }
  },

  create: async (postData: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
    console.log('🔍 [postsApi.create] Starting...', postData)
    
    if (isDemoMode) {
      console.log('🔍 [postsApi.create] Demo mode - returning mock post')
      const newPost: Post = {
        id: Date.now().toString(),
        ...postData,
        created_at: new Date().toISOString(),
        status: 'active',
        tags: postData.tags || []
      }
      return newPost
    }
    
    try {
      console.log('🔍 [postsApi.create] Creating post...')
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
        console.error('❌ [postsApi.create] Database error:', error)
        throw error
      }
      
      console.log('✅ [postsApi.create] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [postsApi.create] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Post>): Promise<Post> => {
    console.log('🔍 [postsApi.update] Starting...', { id, updates })
    
    if (isDemoMode) {
      console.log('🔍 [postsApi.update] Demo mode - returning updated mock post')
      const existingPost = DEMO_POSTS.find(post => post.id === id)
      if (!existingPost) throw new Error('Post not found')
      return { ...existingPost, ...updates }
    }
    
    try {
      console.log('🔍 [postsApi.update] Updating post...')
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [postsApi.update] Database error:', error)
        throw error
      }
      
      console.log('✅ [postsApi.update] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [postsApi.update] Exception:', err)
      throw err
    }
  },

  delete: async (id: string): Promise<void> => {
    console.log('🔍 [postsApi.delete] Starting...', id)
    
    if (isDemoMode) {
      console.log('🔍 [postsApi.delete] Demo mode - mock delete')
      return
    }
    
    try {
      console.log('🔍 [postsApi.delete] Deleting post...')
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ [postsApi.delete] Database error:', error)
        throw error
      }
      
      console.log('✅ [postsApi.delete] Success')
    } catch (err) {
      console.error('❌ [postsApi.delete] Exception:', err)
      throw err
    }
  }
}

// Messages API
export const messagesApi = {
  getConversations: async (userId: string): Promise<Conversation[]> => {
    console.log('🔍 [messagesApi.getConversations] Starting...', userId)
    
    if (isDemoMode) {
      console.log('🔍 [messagesApi.getConversations] Demo mode - returning mock conversations')
      const mockConversations = [
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
      console.log('🔍 [messagesApi.getConversations] Mock conversations:', mockConversations)
      return mockConversations
    }
    
    try {
      console.log('🔍 [messagesApi.getConversations] Querying conversations...')
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [userId])
        .order('updated_at', { ascending: false })
      
      if (error) {
        console.error('❌ [messagesApi.getConversations] Database error:', error)
        throw error
      }
      
      console.log('✅ [messagesApi.getConversations] Success:', data?.length || 0, 'conversations')
      
      // If no real conversations exist, return mock ones for testing
      if (!data || data.length === 0) {
        console.log('🔍 [messagesApi.getConversations] No real conversations found, returning mock ones')
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
      console.error('❌ [messagesApi.getConversations] Exception:', err)
      throw err
    }
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    console.log('🔍 [messagesApi.getMessages] Starting...', conversationId)
    
    if (isDemoMode) {
      console.log('🔍 [messagesApi.getMessages] Demo mode - returning mock messages')
      // Get the current user ID from the conversation participants
      const currentUserId = 'demo-user-1'; // For demo mode
      const otherUserId = 'user2';
      
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
    
    try {
      console.log('🔍 [messagesApi.getMessages] Querying messages...')
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('❌ [messagesApi.getMessages] Database error:', error)
        throw error
      }
      
      console.log('✅ [messagesApi.getMessages] Success:', data?.length || 0, 'messages')
      
      // If no real messages exist, return mock ones for testing
      if (!data || data.length === 0) {
        console.log('🔍 [messagesApi.getMessages] No real messages found, returning mock ones')
        
        // Get the conversation to find the current user ID
        const { data: conversationData, error: convError } = await supabase
          .from('conversations')
          .select('participants')
          .eq('id', conversationId)
          .single()
        
        if (convError) {
          console.error('❌ [messagesApi.getMessages] Failed to get conversation:', convError)
          return []
        }
        
        // Get the current user ID from auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('❌ [messagesApi.getMessages] Failed to get current user:', authError)
          return []
        }
        
        const currentUserId = user.id
        const otherUserId = conversationData.participants.find((id: string) => id !== currentUserId) || 'user2'
        
        console.log('🔍 [messagesApi.getMessages] Using user IDs:', { currentUserId, otherUserId })
        
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
      console.error('❌ [messagesApi.getMessages] Exception:', err)
      throw err
    }
  },

  sendMessage: async (messageData: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
    console.log('🔍 [messagesApi.sendMessage] Starting...', messageData)
    
    if (isDemoMode) {
      console.log('🔍 [messagesApi.sendMessage] Demo mode - returning mock message')
      const newMessage: Message = {
        id: Date.now().toString(),
        ...messageData,
        created_at: new Date().toISOString(),
      }
      return newMessage
    }
    
    try {
      console.log('🔍 [messagesApi.sendMessage] Sending message...')
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
        console.error('❌ [messagesApi.sendMessage] Database error:', error)
        throw error
      }
      
      console.log('✅ [messagesApi.sendMessage] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [messagesApi.sendMessage] Exception:', err)
      throw err
    }
  },

  markAsRead: async (messageId: string) => {
    console.log('🔍 [messagesApi.markAsRead] Starting...', { messageId })
    
    try {
      console.log('🔍 [messagesApi.markAsRead] Updating message...')
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
      
      if (error) {
        console.error('❌ [messagesApi.markAsRead] Database error:', error)
        throw error
      }
      
      console.log('✅ [messagesApi.markAsRead] Success')
    } catch (err) {
      console.error('❌ [messagesApi.markAsRead] Exception:', err)
      throw err
    }
  },

  getOrCreateConversation: async (participants: string[]): Promise<Conversation> => {
    console.log('🔍 [messagesApi.getOrCreateConversation] Starting...', participants)
    
    if (isDemoMode) {
      console.log('🔍 [messagesApi.getOrCreateConversation] Demo mode - returning mock conversation')
      return {
        id: 'conv' + Date.now(),
        participants,
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    
    try {
      console.log('🔍 [messagesApi.getOrCreateConversation] Looking for existing conversation...')
      const { data: existing, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', participants)
        .single()
      
      if (existing && !searchError) {
        console.log('✅ [messagesApi.getOrCreateConversation] Found existing conversation:', existing)
        return existing
      }
      
      console.log('🔍 [messagesApi.getOrCreateConversation] Creating new conversation...')
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participants,
          unread_count: 0,
        })
        .select()
        .single()
      
      if (createError) {
        console.error('❌ [messagesApi.getOrCreateConversation] Create error:', createError)
        throw createError
      }
      
      console.log('✅ [messagesApi.getOrCreateConversation] Created new conversation:', newConv)
      return newConv
    } catch (err) {
      console.error('❌ [messagesApi.getOrCreateConversation] Exception:', err)
      throw err
    }
  }
}

// Rides API
export const ridesApi = {
  getAll: async (filters?: {
    status?: string
    driverId?: string
  }) => {
    console.log('🔍 [ridesApi.getAll] Starting...', { filters })
    
    try {
      console.log('🔍 [ridesApi.getAll] Building query...')
      let query = supabase.from('rides').select('*')
      
      if (filters?.status) {
        console.log('🔍 [ridesApi.getAll] Adding status filter:', filters.status)
        query = query.eq('status', filters.status)
      }
      if (filters?.driverId) {
        console.log('🔍 [ridesApi.getAll] Adding driverId filter:', filters.driverId)
        query = query.eq('driver_id', filters.driverId)
      }
      
      console.log('🔍 [ridesApi.getAll] Executing query...')
      const { data, error } = await query.order('departure_time', { ascending: true })
      
      if (error) {
        console.error('❌ [ridesApi.getAll] Database error:', error)
        throw error
      }
      
      console.log('✅ [ridesApi.getAll] Success:', data?.length || 0, 'rides')
      return data
    } catch (err) {
      console.error('❌ [ridesApi.getAll] Exception:', err)
      throw err
    }
  },

  create: async (rideData: Omit<Ride, 'id' | 'created_at'>) => {
    console.log('🔍 [ridesApi.create] Starting...', rideData)
    
    try {
      console.log('🔍 [ridesApi.create] Inserting into database...')
      const { data, error } = await supabase
        .from('rides')
        .insert(rideData)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [ridesApi.create] Database error:', error)
        throw error
      }
      
      console.log('✅ [ridesApi.create] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [ridesApi.create] Exception:', err)
      throw err
    }
  },

  update: async (id: string, updates: Partial<Ride>) => {
    console.log('🔍 [ridesApi.update] Starting...', { id, updates })
    
    try {
      console.log('🔍 [ridesApi.update] Updating in database...')
      const { data, error } = await supabase
        .from('rides')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [ridesApi.update] Database error:', error)
        throw error
      }
      
      console.log('✅ [ridesApi.update] Success:', data)
      return data
    } catch (err) {
      console.error('❌ [ridesApi.update] Exception:', err)
      throw err
    }
  }
} 

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  console.log('🔍 [testSupabaseConnection] Starting connection test...')
  
  try {
    console.log('🔍 [testSupabaseConnection] Testing basic query...')
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ [testSupabaseConnection] Connection failed:', error)
      return false
    }
    
    console.log('✅ [testSupabaseConnection] Connection successful!')
    return true
  } catch (err) {
    console.error('❌ [testSupabaseConnection] Connection error:', err)
    return false
  }
}

// Comprehensive database inspection function
export const inspectDatabase = async () => {
  console.log('🔍 [inspectDatabase] Starting comprehensive database inspection...')
  
  try {
    // Check if tables exist and get their structure
    const tables = ['users', 'posts', 'conversations', 'messages', 'rides']
    
    for (const tableName of tables) {
      try {
        console.log(`🔍 [inspectDatabase] Checking table: ${tableName}`)
        
        // Try to select from the table
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ [inspectDatabase] Table ${tableName} error:`, error)
        } else {
          console.log(`✅ [inspectDatabase] Table ${tableName} exists and accessible`)
          
          // If we got data, show the structure
          if (data && data.length > 0) {
            console.log(`📊 [inspectDatabase] Sample row structure:`, Object.keys(data[0]))
          }
        }
      } catch (err) {
        console.error(`❌ [inspectDatabase] Failed to check table ${tableName}:`, err)
      }
    }
    
    // Test specific schema requirements
    console.log('🔍 [inspectDatabase] Testing specific schema requirements...')
    
    // Test conversations.participants as TEXT[]
    try {
      console.log('🔍 [inspectDatabase] Testing conversations.participants...')
      const { data, error } = await supabase
        .from('conversations')
        .select('participants')
        .limit(1)
      
      if (error) {
        console.error('❌ [inspectDatabase] conversations.participants test failed:', error)
      } else {
        console.log('✅ [inspectDatabase] conversations.participants is accessible')
        if (data && data.length > 0) {
          console.log('📊 [inspectDatabase] participants type:', typeof data[0].participants, Array.isArray(data[0].participants))
        }
      }
    } catch (err) {
      console.error('❌ [inspectDatabase] conversations.participants test error:', err)
    }
    
    // Test posts schema
    try {
      console.log('🔍 [inspectDatabase] Testing posts schema...')
      const { data, error } = await supabase
        .from('posts')
        .select('user_id, type, title, is_flash_deal, flash_deal_expires_at')
        .limit(1)
      
      if (error) {
        console.error('❌ [inspectDatabase] posts schema test failed:', error)
      } else {
        console.log('✅ [inspectDatabase] posts schema is accessible')
        if (data && data.length > 0) {
          console.log('📊 [inspectDatabase] posts sample fields:', Object.keys(data[0]))
        }
      }
    } catch (err) {
      console.error('❌ [inspectDatabase] posts schema test error:', err)
    }
    
    // Test messages schema
    try {
      console.log('🔍 [inspectDatabase] Testing messages schema...')
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, conversation_id, read')
        .limit(1)
      
      if (error) {
        console.error('❌ [inspectDatabase] messages schema test failed:', error)
      } else {
        console.log('✅ [inspectDatabase] messages schema is accessible')
        if (data && data.length > 0) {
          console.log('📊 [inspectDatabase] messages sample fields:', Object.keys(data[0]))
        }
      }
    } catch (err) {
      console.error('❌ [inspectDatabase] messages schema test error:', err)
    }
    
    console.log('✅ [inspectDatabase] Database inspection complete!')
    return true
    
  } catch (err) {
    console.error('❌ [inspectDatabase] Database inspection failed:', err)
    return false
  }
} 
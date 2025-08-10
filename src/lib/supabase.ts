import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// Debug environment variables
console.log('🔍 [supabase] Environment variables check:')
console.log('🔍 [supabase] REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL)
console.log('🔍 [supabase] REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING')
console.log('🔍 [supabase] REACT_APP_SUPABASE_ANON_KEY length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length || 0)

// Check if we're in demo mode
const isDemoMode = !process.env.REACT_APP_SUPABASE_URL || 
                   !process.env.REACT_APP_SUPABASE_ANON_KEY ||
                   process.env.REACT_APP_SUPABASE_URL === 'https://placeholder.supabase.co' ||
                   process.env.REACT_APP_SUPABASE_ANON_KEY === 'placeholder-key'

console.log('🔍 [supabase] Initializing Supabase client...')
console.log('🔍 [supabase] URL:', supabaseUrl)
console.log('🔍 [supabase] isDemoMode:', isDemoMode)
console.log('🔍 [supabase] URL check:', !process.env.REACT_APP_SUPABASE_URL)
console.log('🔍 [supabase] KEY check:', !process.env.REACT_APP_SUPABASE_ANON_KEY)
console.log('🔍 [supabase] URL placeholder check:', process.env.REACT_APP_SUPABASE_URL === 'https://placeholder.supabase.co')
console.log('🔍 [supabase] KEY placeholder check:', process.env.REACT_APP_SUPABASE_ANON_KEY === 'placeholder-key')

if (isDemoMode) {
  console.warn('⚠️ [supabase] Missing or invalid Supabase environment variables. App will run in demo mode.')
} else {
  console.log('✅ [supabase] Supabase environment variables detected. Attempting real connection...')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    console.log('🔍 [auth.signUp] Starting...', { email, userData })
    
    if (isDemoMode) {
      console.log('🔍 [auth.signUp] Demo mode - returning mock success')
      // Return mock success in demo mode
      return { 
        data: { 
          user: { 
            id: 'demo-user', 
            email: email,
            user_metadata: {
              ...userData,
              university: 'Purdue University'
            }
          } 
        }, 
        error: null 
      }
    }
    
    try {
      console.log('🔍 [auth.signUp] Calling supabase.auth.signUp...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('❌ [auth.signUp] Supabase error:', error)
      } else {
        console.log('✅ [auth.signUp] Supabase signup successful:', data)
      }
      
      return { data, error }
    } catch (err) {
      console.error('❌ [auth.signUp] Exception:', err)
      return { data: null, error: err }
    }
  },

  signIn: async (email: string, password: string) => {
    console.log('🔍 [auth.signIn] Starting...', { email })
    
    if (isDemoMode) {
      console.log('🔍 [auth.signIn] Demo mode - returning mock success')
      // Return mock success in demo mode
      return { 
        data: { 
          user: { 
            id: 'demo-user', 
            email: email,
            user_metadata: {
              name: 'Demo User',
              university: 'Purdue University'
            }
          },
          session: { user: { id: 'demo-user', email: email } }
        }, 
        error: null 
      }
    }
    
    try {
      console.log('🔍 [auth.signIn] Calling supabase.auth.signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ [auth.signIn] Supabase error:', error)
      } else {
        console.log('✅ [auth.signIn] Supabase signin successful:', data)
      }
      
      return { data, error }
    } catch (err) {
      console.error('❌ [auth.signIn] Exception:', err)
      return { data: null, error: err }
    }
  },

  signOut: async () => {
    console.log('🔍 [auth.signOut] Starting...')
    
    if (isDemoMode) {
      console.log('🔍 [auth.signOut] Demo mode - returning mock success')
      return { error: null }
    }
    
    try {
      console.log('🔍 [auth.signOut] Calling supabase.auth.signOut...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ [auth.signOut] Supabase error:', error)
      } else {
        console.log('✅ [auth.signOut] Supabase signout successful')
      }
      
      return { error }
    } catch (err) {
      console.error('❌ [auth.signOut] Exception:', err)
      return { error: err }
    }
  },

  getCurrentUser: async () => {
    console.log('🔍 [auth.getCurrentUser] Starting...')
    
    if (isDemoMode) {
      console.log('🔍 [auth.getCurrentUser] Demo mode - returning mock user')
      return { 
        user: { 
          id: 'demo-user', 
          email: 'demo@example.com',
          user_metadata: {
            name: 'Demo User',
            university: 'Purdue University'
          }
        }, 
        error: null 
      }
    }
    
    try {
      console.log('🔍 [auth.getCurrentUser] Calling supabase.auth.getUser...')
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ [auth.getCurrentUser] Supabase error:', error)
      } else {
        console.log('✅ [auth.getCurrentUser] Supabase getUser successful:', user)
      }
      
      return { user, error }
    } catch (err) {
      console.error('❌ [auth.getCurrentUser] Exception:', err)
      return { user: null, error: err }
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    console.log('🔍 [auth.onAuthStateChange] Setting up auth state listener...')
    
    if (isDemoMode) {
      console.log('🔍 [auth.onAuthStateChange] Demo mode - returning mock subscription')
      // Return a mock subscription that immediately calls the callback
      const mockSubscription = {
        unsubscribe: () => {
          console.log('🔍 [auth.onAuthStateChange] Mock subscription unsubscribed')
        }
      }
      
      // Simulate immediate sign-in for demo mode
      setTimeout(() => {
        console.log('🔍 [auth.onAuthStateChange] Demo mode - simulating SIGNED_IN event')
        callback('SIGNED_IN', { 
          user: { 
            id: 'demo-user', 
            email: 'demo@example.com' 
          } 
        })
      }, 100)
      
      return { data: { subscription: mockSubscription } }
    }
    
    try {
      console.log('🔍 [auth.onAuthStateChange] Calling supabase.auth.onAuthStateChange...')
      const result = supabase.auth.onAuthStateChange(callback)
      console.log('✅ [auth.onAuthStateChange] Auth state listener set up')
      return result
    } catch (err) {
      console.error('❌ [auth.onAuthStateChange] Exception:', err)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  }
} 
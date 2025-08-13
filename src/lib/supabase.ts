import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY')
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

// Storage helpers
export const storage = {
  uploadPostImages: async (files: File[], userId: string): Promise<string[]> => {
    const bucket = 'post-images'
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: false,
        contentType: file.type || 'image/jpeg'
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }
}
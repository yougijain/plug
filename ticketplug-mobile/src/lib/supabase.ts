import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file')
}

// Only create client if we have valid credentials
let supabase: ReturnType<typeof createClient<Database>> | null = null

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  // Create a dummy client that won't crash
  supabase = createClient<Database>('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export { supabase }

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      })
      
      if (error) {
        console.error('Sign up error:', error.message)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Sign up exception:', err)
      return { data: null, error: err }
    }
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
        return { data: null, error }
      }
      
      return { 
        data: {
          user: data.user,
          session: data.session
        }, 
        error: null 
      }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { data: null, error: err }
    }
  },

  signOut: async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error.message)
      }
      
      return { error }
    } catch (err) {
      console.error('Sign out exception:', err)
      return { error: err }
    }
  },

  getCurrentUser: async () => {
    if (!supabase) {
      return { user: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Get user error:', error.message)
      }
      
      return { user, error }
    } catch (err) {
      console.error('Get user exception:', err)
      return { user: null, error: err }
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      console.error('Auth state change exception:', err)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  }
}

// Storage helpers for React Native
export const storage = {
  uploadImages: async (uris: string[], userId: string): Promise<string[]> => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    const bucket = 'post-images'
    const urls: string[] = []
    
    for (const uri of uris) {
      const response = await fetch(uri)
      const blob = await response.blob()
      const ext = uri.split('.').pop() || 'jpg'
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, blob, {
        upsert: false,
        contentType: 'image/jpeg'
      })
      
      if (upErr) throw upErr
      
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    
    return urls
  }
}


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
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
        return { data: null, error }
      }
      
      // Return both user and session
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
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      console.error('Auth state change exception:', err)
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
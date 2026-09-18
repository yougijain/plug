import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { isDemoMode, isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env'
import { log, logError } from './logger'
import { demoAuth, demoStorage } from './demo/backend'
import type { User } from '../types'

/**
 * Supabase client plus the auth and storage helpers the app calls.
 *
 * With no credentials configured the app runs against the demo backend instead
 * of failing at import time — a missing env var must never blank the page.
 */

const unconfiguredClient = () =>
  new Proxy(
    {},
    {
      get(_target, property) {
        throw new Error(
          `Supabase is not configured (tried to use "${String(property)}"). ` +
            'Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY, or run in demo mode.'
        )
      },
    }
  ) as SupabaseClient<Database>

export const supabase: SupabaseClient<Database> = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : unconfiguredClient()

/* ------------------------------------------------------------------ auth --- */

/** The contract both backends implement, so callers never branch on mode. */
export interface AuthAdapter {
  signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<{ data: any; error: any }>
  signIn(email: string, password: string): Promise<{ data: any; error: any }>
  signOut(): Promise<{ error: any }>
  getCurrentUser(): Promise<{ user: any; error: any }>
  onAuthStateChange(callback: (event: string, session: any) => void): {
    data: { subscription: { unsubscribe: () => void } }
  }
  /** Signs a visitor straight into the seeded demo account. */
  enterDemo(): Promise<{ data: any; error: any }>
  /** Clears visitor-created demo data. No-op against a real project. */
  resetDemoData(): void
}

const supabaseAuth: AuthAdapter = {
  signUp: async (email: string, password: string, userData: Partial<User>) => {
    log('[auth.signUp]', email)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      })
      if (error) logError('[auth.signUp] failed:', error.message)
      return { data, error }
    } catch (err) {
      logError('[auth.signUp] threw:', err)
      return { data: null, error: err }
    }
  },

  signIn: async (email: string, password: string) => {
    log('[auth.signIn]', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) logError('[auth.signIn] failed:', error.message)
      return { data, error }
    } catch (err) {
      logError('[auth.signIn] threw:', err)
      return { data: null, error: err }
    }
  },

  signOut: async () => {
    log('[auth.signOut]')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) logError('[auth.signOut] failed:', error.message)
      return { error }
    } catch (err) {
      logError('[auth.signOut] threw:', err)
      return { error: err }
    }
  },

  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      return { user, error }
    } catch (err) {
      logError('[auth.getCurrentUser] threw:', err)
      return { user: null, error: err }
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      logError('[auth.onAuthStateChange] threw:', err)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  },

  /** Demo-only shortcut; unavailable against a real Supabase project. */
  enterDemo: async () => ({
    data: null,
    error: { message: 'Demo sign-in is only available when the app runs in demo mode.' },
  }),

  resetDemoData: () => {},
}

export const auth: AuthAdapter = isDemoMode ? demoAuth : supabaseAuth

/* --------------------------------------------------------------- storage --- */

export interface StorageAdapter {
  uploadPostImages(files: File[], userId: string): Promise<string[]>
}

const supabaseStorage: StorageAdapter = {
  uploadPostImages: async (files: File[], userId: string): Promise<string[]> => {
    const bucket = 'post-images'
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: false,
        contentType: file.type || 'image/jpeg',
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  },
}

export const storage: StorageAdapter = isDemoMode ? demoStorage : supabaseStorage

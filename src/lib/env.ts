/**
 * Runtime configuration.
 *
 * The app has two interchangeable backends:
 *
 *  - Supabase  — used when REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY are set.
 *  - Demo      — an in-browser backend seeded with realistic campus data, used when
 *                Supabase credentials are absent or REACT_APP_DEMO_MODE=true.
 *
 * Demo mode exists so the public deployment is always explorable: no credentials,
 * no cold database, no sign-up wall. Both backends implement the same interfaces
 * in `src/lib/api.ts`, so page and hook code is identical either way.
 */

const url = process.env.REACT_APP_SUPABASE_URL?.trim()
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY?.trim()

export const supabaseUrl = url || ''
export const supabaseAnonKey = anonKey || ''

/** True when real Supabase credentials were provided at build time. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/** Demo mode is forced on with REACT_APP_DEMO_MODE=true, and is the fallback with no credentials. */
export const isDemoMode =
  process.env.REACT_APP_DEMO_MODE === 'true' || !isSupabaseConfigured

/** Verbose data-layer logging: on in development, off in production builds. */
export const isVerboseLogging = process.env.NODE_ENV !== 'production'

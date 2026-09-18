import type { Conversation, Message, Post, Ride, User } from '../../types'
import {
  DEMO_CONVERSATIONS,
  DEMO_MESSAGES,
  DEMO_POSTS,
  DEMO_RIDES,
  DEMO_USER,
  DEMO_USERS,
} from './seed'

/**
 * In-browser persistence for demo mode.
 *
 * Seed data is cloned into localStorage on first load, so anything a visitor
 * creates (a listing, a reply) survives a refresh without a server. Every
 * storage access is guarded: private windows and blocked site data must degrade
 * to an in-memory session rather than throwing.
 */

const STORAGE_KEY = 'plug.demo.state.v1'

export interface DemoState {
  users: User[]
  posts: Post[]
  conversations: Conversation[]
  messages: Message[]
  rides: Ride[]
  /** id of the signed-in demo user, or null when signed out */
  sessionUserId: string | null
}

const freshState = (): DemoState => ({
  users: JSON.parse(JSON.stringify(DEMO_USERS)),
  posts: JSON.parse(JSON.stringify(DEMO_POSTS)),
  conversations: JSON.parse(JSON.stringify(DEMO_CONVERSATIONS)),
  messages: JSON.parse(JSON.stringify(DEMO_MESSAGES)),
  rides: JSON.parse(JSON.stringify(DEMO_RIDES)),
  sessionUserId: null,
})

const readStorage = (): DemoState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DemoState>
    if (!Array.isArray(parsed.posts) || !Array.isArray(parsed.users)) return null
    return { ...freshState(), ...parsed } as DemoState
  } catch {
    return null
  }
}

let state: DemoState = readStorage() ?? freshState()

const persist = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or storage blocked — the in-memory copy stays authoritative.
  }
}

export const getState = (): DemoState => state

export const mutate = (fn: (draft: DemoState) => void) => {
  fn(state)
  persist()
}

/** Wipe visitor changes and restore the seeded dataset. */
export const resetDemoState = () => {
  const signedInAs = state.sessionUserId
  state = { ...freshState(), sessionUserId: signedInAs }
  persist()
}

export const DEMO_IDENTITY = DEMO_USER

/** Simulated network latency, so loading and skeleton states are exercised. */
export const tick = (ms = 160) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

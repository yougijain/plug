import type { Database } from '../../types/database'
import type { Conversation, Message, Post, Ride, User } from '../../types'
import { log } from '../logger'
import { DEMO_IDENTITY, getState, mutate, newId, resetDemoState, tick } from './store'

/**
 * Demo backend.
 *
 * Mirrors the Supabase-backed API in `src/lib/api.ts` function for function, so
 * `api.ts` can pick between the two at startup and nothing downstream changes.
 */

type Tables = Database['public']['Tables']
type UserRow = Tables['users']['Row']
type PostRow = Tables['posts']['Row']
type MessageRow = Tables['messages']['Row']
type ConversationRow = Tables['conversations']['Row']
type RideRow = Tables['rides']['Row']

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const sellerSummary = (userId: string) => {
  const user = getState().users.find((u) => u.id === userId)
  return user
    ? { name: user.name, avatar: user.avatar, university: user.university }
    : { name: 'Anonymous', avatar: undefined, university: '' }
}

/** Attach the joined seller fields the Supabase query returns via `users (...)`. */
const withSeller = (post: Post): Post => ({ ...post, users: sellerSummary(post.user_id) })

const byNewestFirst = (a: { created_at: string }, b: { created_at: string }) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

/* ------------------------------------------------------------------ auth --- */

interface DemoAuthUser {
  id: string
  email: string
  email_confirmed_at: string
  user_metadata: { name: string; university: string; avatar?: string }
}

type AuthListener = (event: string, session: { user: DemoAuthUser } | null) => void

const listeners = new Set<AuthListener>()

const toAuthUser = (user: User): DemoAuthUser => ({
  id: user.id,
  email: user.email,
  // Demo accounts are pre-verified; the real app gates on Supabase email confirmation.
  email_confirmed_at: new Date().toISOString(),
  user_metadata: { name: user.name, university: user.university, avatar: user.avatar },
})

const emit = (event: string, user: User | null) => {
  const session = user ? { user: toAuthUser(user) } : null
  listeners.forEach((listener) => {
    try {
      listener(event, session)
    } catch (err) {
      console.error('[demo auth] listener failed', err)
    }
  })
}

const currentUser = (): User | null => {
  const { users, sessionUserId } = getState()
  if (!sessionUserId) return null
  return users.find((u) => u.id === sessionUserId) ?? null
}

const signInAs = (user: User) => {
  mutate((draft) => {
    if (!draft.users.some((u) => u.id === user.id)) draft.users.push(user)
    draft.sessionUserId = user.id
  })
  emit('SIGNED_IN', user)
  return user
}

export const demoAuth = {
  /** One-click entry used by the "Explore the demo" button. */
  enterDemo: async () => {
    await tick(120)
    const seeded = getState().users.find((u) => u.id === DEMO_IDENTITY.id) ?? DEMO_IDENTITY
    const user = signInAs(seeded)
    log('[demo auth] entered demo as', user.email)
    return { data: { user: toAuthUser(user) }, error: null }
  },

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    await tick(220)
    if (password.length < 6) {
      return { data: null, error: { message: 'Password must be at least 6 characters long.' } }
    }
    const existing = getState().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return {
        data: null,
        error: { message: 'An account with this email already exists. Please sign in instead.' },
      }
    }
    const user: User = {
      id: newId('user'),
      email,
      name: userData.name || email.split('@')[0],
      university: userData.university || '',
      avatar: userData.avatar,
      verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    signInAs(user)
    return { data: { user: toAuthUser(user) }, error: null }
  },

  signIn: async (email: string, password: string) => {
    await tick(220)
    if (!password) {
      return { data: null, error: { message: 'Password is required' } }
    }
    // Demo mode has no credential store: any known .edu address signs in, and an
    // unknown one is created on the spot so a visitor is never locked out.
    const existing = getState().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    const user =
      existing ??
      ({
        id: newId('user'),
        email,
        name: email.split('@')[0],
        university: email.toLowerCase().endsWith('iu.edu')
          ? 'Indiana University'
          : 'Purdue University',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as User)
    signInAs(user)
    return { data: { user: toAuthUser(user) }, error: null }
  },

  signOut: async () => {
    await tick(80)
    mutate((draft) => {
      draft.sessionUserId = null
    })
    emit('SIGNED_OUT', null)
    return { error: null }
  },

  getCurrentUser: async () => {
    await tick(60)
    const user = currentUser()
    return { user: user ? toAuthUser(user) : null, error: null }
  },

  onAuthStateChange: (callback: AuthListener) => {
    listeners.add(callback)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            listeners.delete(callback)
          },
        },
      },
    }
  },

  resetDemoData: () => resetDemoState(),
}

/* --------------------------------------------------------------- storage --- */

/**
 * Downscale an image in the browser and return a data URL. Keeps uploaded
 * photos small enough to sit in localStorage alongside the rest of the state.
 */
const toDownscaledDataUrl = (file: File, maxEdge = 900): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.onload = () => {
      const source = String(reader.result)
      const image = new Image()
      image.onerror = () => resolve(source) // non-raster file: hand back the original
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(source)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      image.src = source
    }
    reader.readAsDataURL(file)
  })

export const demoStorage = {
  uploadPostImages: async (files: File[], _userId: string): Promise<string[]> => {
    await tick(200)
    return Promise.all(files.slice(0, 4).map((file) => toDownscaledDataUrl(file)))
  },
}

/* ------------------------------------------------------------------ data --- */

export const demoUserApi = {
  getCurrentUser: async (): Promise<UserRow | null> => {
    await tick(80)
    const user = currentUser()
    return user ? (clone(user) as UserRow) : null
  },

  updateProfile: async (userId: string, updates: Partial<UserRow>) => {
    await tick(140)
    let updated: User | undefined
    mutate((draft) => {
      const index = draft.users.findIndex((u) => u.id === userId)
      if (index === -1) throw new Error('User not found')
      draft.users[index] = {
        ...draft.users[index],
        ...updates,
        updated_at: new Date().toISOString(),
      } as User
      updated = draft.users[index]
    })
    return clone(updated) as UserRow
  },

  getByIds: async (ids: string[]): Promise<UserRow[]> => {
    await tick(60)
    return clone(getState().users.filter((u) => ids.includes(u.id))) as UserRow[]
  },

  createUser: async (
    params: { id: string } & Omit<UserRow, 'id' | 'created_at' | 'updated_at'>
  ) => {
    await tick(120)
    const now = new Date().toISOString()
    let saved: User | undefined
    mutate((draft) => {
      const index = draft.users.findIndex((u) => u.id === params.id)
      const record: User = {
        id: params.id,
        email: params.email,
        name: params.name,
        university: params.university,
        avatar: params.avatar,
        verified: params.verified ?? false,
        created_at: index === -1 ? now : draft.users[index].created_at,
        updated_at: now,
      }
      if (index === -1) draft.users.push(record)
      else draft.users[index] = record
      saved = record
    })
    return clone(saved) as UserRow
  },
}

export const demoPostsApi = {
  getAll: async (filters?: {
    type?: string
    category?: string
    status?: string
    userId?: string
    isFlash?: boolean
  }): Promise<PostRow[]> => {
    await tick()
    const wantedStatus = filters?.status ?? 'active'
    const posts = getState()
      .posts.filter((post) => {
        if (wantedStatus !== 'any' && post.status !== wantedStatus) return false
        if (filters?.type && post.type !== filters.type) return false
        if (filters?.category && post.category !== filters.category) return false
        if (filters?.userId && post.user_id !== filters.userId) return false
        if (typeof filters?.isFlash === 'boolean') {
          return Boolean(post.is_flash_deal) === filters.isFlash
        }
        return true
      })
      .sort(byNewestFirst)
      .map(withSeller)
    log('[demo posts] getAll ->', posts.length, 'posts', filters ?? {})
    return clone(posts) as PostRow[]
  },

  getById: async (id: string): Promise<PostRow | null> => {
    await tick(120)
    const post = getState().posts.find((p) => p.id === id)
    if (!post) throw new Error('That listing could not be found.')
    return clone(withSeller(post)) as PostRow
  },

  create: async (postData: Omit<PostRow, 'id' | 'created_at'>): Promise<PostRow> => {
    await tick(320)
    const created: Post = {
      ...(postData as unknown as Post),
      id: newId('post'),
      created_at: new Date().toISOString(),
      status: 'active',
      tags: postData.tags || [],
      is_flash_deal: postData.is_flash_deal || false,
    }
    mutate((draft) => {
      if (!draft.users.some((u) => u.id === created.user_id)) {
        const signedIn = currentUser()
        if (signedIn) draft.users.push(signedIn)
      }
      draft.posts.unshift(created)
    })
    return clone(withSeller(created)) as PostRow
  },

  update: async (id: string, updates: Partial<PostRow>): Promise<PostRow> => {
    await tick(160)
    let updated: Post | undefined
    mutate((draft) => {
      const index = draft.posts.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('That listing could not be found.')
      draft.posts[index] = { ...draft.posts[index], ...(updates as Partial<Post>) }
      updated = draft.posts[index]
    })
    return clone(withSeller(updated as Post)) as PostRow
  },

  delete: async (id: string): Promise<void> => {
    await tick(140)
    mutate((draft) => {
      draft.posts = draft.posts.filter((p) => p.id !== id)
    })
  },
}

export const demoMessagesApi = {
  getConversations: async (userId: string): Promise<ConversationRow[]> => {
    await tick(140)
    const conversations = getState()
      .conversations.filter((conversation) => conversation.participants.includes(userId))
      .sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    return clone(conversations) as ConversationRow[]
  },

  getMessages: async (conversationId: string): Promise<MessageRow[]> => {
    await tick(120)
    const messages = getState()
      .messages.filter((message) => message.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    return clone(messages) as MessageRow[]
  },

  sendMessage: async (messageData: Omit<MessageRow, 'id' | 'created_at'>): Promise<MessageRow> => {
    await tick(120)
    const message: Message = {
      ...(messageData as unknown as Message),
      id: newId('msg'),
      created_at: new Date().toISOString(),
      read: messageData.read || false,
    }
    mutate((draft) => {
      draft.messages.push(message)
      const index = draft.conversations.findIndex((c) => c.id === message.conversation_id)
      if (index !== -1) {
        draft.conversations[index] = {
          ...draft.conversations[index],
          last_message_id: message.id,
          updated_at: message.created_at,
          unread_count: 0,
        }
      }
    })
    return clone(message) as MessageRow
  },

  markAsRead: async (messageId: string) => {
    await tick(60)
    mutate((draft) => {
      const index = draft.messages.findIndex((m) => m.id === messageId)
      if (index !== -1) draft.messages[index] = { ...draft.messages[index], read: true }
    })
  },

  getOrCreateConversation: async (participants: string[]): Promise<ConversationRow> => {
    await tick(140)
    const existing = getState().conversations.find(
      (conversation) =>
        conversation.participants.length === participants.length &&
        participants.every((id) => conversation.participants.includes(id))
    )
    if (existing) return clone(existing) as ConversationRow

    const now = new Date().toISOString()
    const conversation: Conversation = {
      id: newId('conv'),
      participants,
      unread_count: 0,
      created_at: now,
      updated_at: now,
    }
    mutate((draft) => {
      draft.conversations.unshift(conversation)
    })
    return clone(conversation) as ConversationRow
  },
}

export const demoRidesApi = {
  getAll: async (filters?: { status?: string; driverId?: string }) => {
    await tick(140)
    const rides = getState()
      .rides.filter((ride) => {
        if (filters?.status && ride.status !== filters.status) return false
        if (filters?.driverId && ride.driver_id !== filters.driverId) return false
        return true
      })
      .sort(
        (a, b) =>
          new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      )
    return clone(rides) as RideRow[]
  },

  create: async (rideData: Omit<RideRow, 'id' | 'created_at'>) => {
    await tick(220)
    const ride: Ride = {
      ...(rideData as unknown as Ride),
      id: newId('ride'),
      created_at: new Date().toISOString(),
      status: rideData.status || 'active',
    }
    mutate((draft) => {
      draft.rides.unshift(ride)
    })
    return clone(ride) as RideRow
  },

  update: async (id: string, updates: Partial<RideRow>) => {
    await tick(160)
    let updated: Ride | undefined
    mutate((draft) => {
      const index = draft.rides.findIndex((r) => r.id === id)
      if (index === -1) throw new Error('Ride not found')
      draft.rides[index] = { ...draft.rides[index], ...(updates as Partial<Ride>) }
      updated = draft.rides[index]
    })
    return clone(updated) as RideRow
  },
}

export const demoConnectionCheck = async () => ({
  success: true as const,
  mode: 'demo' as const,
  message: 'Demo backend ready (in-browser, seeded dataset).',
})

import { create } from 'zustand'
import { User, Post } from '../types'

interface AppState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  savedPosts: Post[]
  cart: Post[]
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  savePost: (post: Post) => void
  removeSavedPost: (postId: string) => void
  addToCart: (post: Post) => void
  removeFromCart: (postId: string) => void
  clearCart: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  savedPosts: [],
  cart: [],
  setCurrentUser: (user) => {
    console.log('🔍 [store] setCurrentUser called with:', user)
    set({ currentUser: user })
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => {
    console.log('🔍 [store] setError called with:', error)
    set({ error })
  },
  clearError: () => set({ error: null }),
  savePost: (post) => set((state) => {
    const exists = state.savedPosts.some((p) => p.id === post.id)
    return exists ? state : { savedPosts: [post, ...state.savedPosts] }
  }),
  removeSavedPost: (postId) => set((state) => ({
    savedPosts: state.savedPosts.filter((p) => p.id !== postId)
  })),
  addToCart: (post) => set((state) => {
    const exists = state.cart.some((p) => p.id === post.id)
    return exists ? state : { cart: [post, ...state.cart] }
  }),
  removeFromCart: (postId) => set((state) => ({
    cart: state.cart.filter((p) => p.id !== postId)
  })),
  clearCart: () => set({ cart: [] }),
})) 
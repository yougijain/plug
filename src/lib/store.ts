import { create } from 'zustand'
import { User, Ticket } from '../types'

interface AppState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  savedPosts: Ticket[]  // Keep name for backward compatibility
  cart: Ticket[]
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  savePost: (ticket: Ticket) => void
  removeSavedPost: (ticketId: string) => void
  toggleSavedPost: (ticket: Ticket) => void
  addToCart: (ticket: Ticket) => void
  removeFromCart: (ticketId: string) => void
  clearCart: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  savedPosts: [],
  cart: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  savePost: (ticket) => set((state) => {
    const exists = state.savedPosts.some((t) => t.id === ticket.id)
    return exists ? state : { savedPosts: [ticket, ...state.savedPosts] }
  }),
  removeSavedPost: (ticketId) => set((state) => ({
    savedPosts: state.savedPosts.filter((t) => t.id !== ticketId)
  })),
  toggleSavedPost: (ticket) => set((state) => {
    const exists = state.savedPosts.some((t) => t.id === ticket.id)
    if (exists) {
      return { savedPosts: state.savedPosts.filter((t) => t.id !== ticket.id) }
    } else {
      return { savedPosts: [ticket, ...state.savedPosts] }
    }
  }),
  addToCart: (ticket) => set((state) => {
    const exists = state.cart.some((t) => t.id === ticket.id)
    return exists ? state : { cart: [ticket, ...state.cart] }
  }),
  removeFromCart: (ticketId) => set((state) => ({
    cart: state.cart.filter((t) => t.id !== ticketId)
  })),
  clearCart: () => set({ cart: [] }),
})) 
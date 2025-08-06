import { create } from 'zustand'
import { User } from '../types'

interface AppState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
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
})) 
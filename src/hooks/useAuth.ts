import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { auth } from '../lib/supabase'
import { userApi } from '../lib/api'
import { useAppStore } from '../lib/store'
import type { User } from '../types'

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useAppStore()
  const { setError, clearError } = useAppStore()

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, userData }: {
      email: string
      password: string
      userData: Omit<User, 'id' | 'verified'>
    }) => {
      console.log('🔍 [useAuth.signUpMutation] Starting signup...', { email, userData })
      clearError() // Clear any previous errors
      
      try {
        console.log('🔍 [useAuth.signUpMutation] Calling auth.signUp...')
        const { data, error } = await auth.signUp(email, password, userData)
        
        if (error) {
          console.error('❌ [useAuth.signUpMutation] Auth signup error:', error)
          
          // Provide user-friendly error messages
          let errorMessage = 'Sign up failed. Please try again.';
          
          const errorMessageStr = (error as any)?.message || '';
          
          if (errorMessageStr.includes('already registered')) {
            errorMessage = 'An account with this email already exists. Please sign in instead.';
          } else if (errorMessageStr.includes('password')) {
            errorMessage = 'Password must be at least 6 characters long.';
          } else if (errorMessageStr.includes('email')) {
            errorMessage = 'Please enter a valid email address.';
          } else if (errorMessageStr) {
            errorMessage = errorMessageStr;
          }
          
          throw new Error(errorMessage);
        }
        
        console.log('✅ [useAuth.signUpMutation] Auth signup successful:', data)
        
        // Create user profile with auth uid to satisfy RLS
        if (data?.user) {
          console.log('🔍 [useAuth.signUpMutation] Creating user profile...')
          await userApi.createUser({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            university: userData.university,
            avatar: userData.avatar,
            verified: false
          })
          console.log('✅ [useAuth.signUpMutation] User profile created')
        }
        
        return data
      } catch (err) {
        console.error('❌ [useAuth.signUpMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (data) => {
      console.log('🔍 [useAuth.signUpMutation] onSuccess called:', data)
      if (data?.user) {
        console.log('🔍 [useAuth.signUpMutation] Setting current user...')
        const user = data.user as any; // Type assertion for user_metadata
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          university: user.user_metadata?.university || '',
          avatar: user.user_metadata?.avatar,
          verified: false
        })
        console.log('✅ [useAuth.signUpMutation] Current user set')
      }
    },
    onError: (error) => {
      console.error('❌ [useAuth.signUpMutation] onError:', error)
      setError(error instanceof Error ? error.message : 'Sign up failed. Please try again.')
    }
  })

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔍 [useAuth.signInMutation] Starting signin...', { email })
      clearError() // Clear any previous errors
      
      try {
        console.log('🔍 [useAuth.signInMutation] Calling auth.signIn...')
        const { data, error } = await auth.signIn(email, password)
        
        if (error) {
          console.error('❌ [useAuth.signInMutation] Auth signin error:', error)
          
          // Provide user-friendly error messages
          let errorMessage = 'Sign in failed. Please try again.';
          
          const errorMessageStr = (error as any)?.message || '';
          
          if (errorMessageStr.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials.';
          } else if (errorMessageStr.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account before signing in.';
          } else if (errorMessageStr) {
            errorMessage = errorMessageStr;
          }
          
          throw new Error(errorMessage);
        }
        
        console.log('✅ [useAuth.signInMutation] Auth signin successful:', data)
        return data
      } catch (err) {
        console.error('❌ [useAuth.signInMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (data) => {
      console.log('🔍 [useAuth.signInMutation] onSuccess called:', data)
      if (data?.user) {
        console.log('🔍 [useAuth.signInMutation] Setting current user...')
        const user = data.user as any; // Type assertion for user_metadata
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          university: user.user_metadata?.university || '',
          avatar: user.user_metadata?.avatar,
          verified: false
        })
        console.log('✅ [useAuth.signInMutation] Current user set')
      }
    },
    onError: (error) => {
      console.error('❌ [useAuth.signInMutation] onError:', error)
      setError(error instanceof Error ? error.message : 'Sign in failed. Please try again.')
    }
  })

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log('🔍 [useAuth.signOutMutation] Starting signout...')
      
      try {
        console.log('🔍 [useAuth.signOutMutation] Calling auth.signOut...')
        const { error } = await auth.signOut()
        
        if (error) {
          console.error('❌ [useAuth.signOutMutation] Auth signout error:', error)
          throw error
        }
        
        console.log('✅ [useAuth.signOutMutation] Auth signout successful')
      } catch (err) {
        console.error('❌ [useAuth.signOutMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: () => {
      console.log('🔍 [useAuth.signOutMutation] onSuccess called')
      console.log('🔍 [useAuth.signOutMutation] Clearing current user...')
      setCurrentUser(null)
      console.log('✅ [useAuth.signOutMutation] Current user cleared')
    },
    onError: (error) => {
      console.error('❌ [useAuth.signOutMutation] onError:', error)
    }
  })

  // Initialize current user if not set (for demo mode)
  useEffect(() => {
    if (!currentUser) {
      console.log('🔍 [useAuth] No current user, checking for demo mode...')
      const checkDemoUser = async () => {
        try {
          const user = await userApi.getCurrentUser()
          if (user) {
            console.log('🔍 [useAuth] Setting demo user:', user)
            setCurrentUser(user)
          }
        } catch (err) {
          console.log('🔍 [useAuth] No user found, staying logged out')
        }
      }
      checkDemoUser()
    }
  }, [currentUser, setCurrentUser])

  // Debug current user state
  console.log('🔍 [useAuth] currentUser from store:', currentUser)
  console.log('🔍 [useAuth] signOutMutation.isPending:', signOutMutation.isPending)

  return {
    currentUser,
    isLoading: signUpMutation.isPending || signInMutation.isPending || signOutMutation.isPending,
    error: null,
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    signOut: signOutMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending
  }
} 
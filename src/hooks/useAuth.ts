import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, createContext, useContext, ReactNode, useState } from 'react'
import { auth } from '../lib/supabase'
import { userApi } from '../lib/api'
import { useAppStore } from '../lib/store'
import type { User } from '../types'
import { log, warn } from '../lib/logger'

// Create AuthContext
const AuthContext = createContext<{
  currentUser: User | null;
  isLoading: boolean;
}>({
  currentUser: null,
  isLoading: true,
});

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, setCurrentUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await auth.getCurrentUser();
        if (result && 'user' in result && result.user) {
          const user = result.user as any;
          // Gate access until email verified
          if (user.email_confirmed_at) {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              university: user.user_metadata?.university || '',
              avatar: user.user_metadata?.avatar,
              verified: true,
            });
          } else {
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const subscription = auth.onAuthStateChange((event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user as any;
          if (user.email_confirmed_at) {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              university: user.user_metadata?.university || '',
              avatar: user.user_metadata?.avatar,
              verified: true,
            });
          } else {
            setCurrentUser(null);
          }
        }
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth state change handling failed:', err);
      }
    });

    return () => {
      try {
        subscription?.data?.subscription?.unsubscribe?.();
      } catch {}
    };
  }, [setCurrentUser]);

  const value = { currentUser, isLoading };
  
  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const { setCurrentUser } = useAppStore();
  const { setError, clearError } = useAppStore();

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, userData }: {
      email: string
      password: string
      userData: Omit<User, 'id' | 'verified'>
    }) => {
      log('[useAuth.signUpMutation] Starting signup...', { email, userData })
      clearError() // Clear any previous errors
      
      try {
        log('[useAuth.signUpMutation] Calling auth.signUp...')
        const { data, error } = await auth.signUp(email, password, userData)
        
        if (error) {
          console.error('[useAuth.signUpMutation] Auth signup error:', error)
          
          // Provide user-friendly error messages
          let errorMessage = 'Sign up failed. Please try again.';
          
          const errorMessageStr = (error as any)?.message || '';
          
          // Special case: Supabase rate-limits verification email resends
          // Message often looks like: "For security reasons/purposes, you can only request this after XX seconds."
          if (errorMessageStr.toLowerCase().includes('for security') ||
              errorMessageStr.toLowerCase().includes('request this after')) {
            warn('[useAuth.signUpMutation] Verification recently sent (rate limited). Treating as success.')
            // Treat as success: return the existing data without throwing
            // so the UI can show a success banner instead of an error.
            return data as any
          }

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
        
        log('[useAuth.signUpMutation] Auth signup successful:', data)
        
        // Create user profile with auth uid to satisfy RLS
        if (data?.user) {
          log('[useAuth.signUpMutation] Creating user profile...')
          await userApi.createUser({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            university: userData.university,
            avatar: userData.avatar,
            verified: false
          })
          log('[useAuth.signUpMutation] User profile created')
        }
        
        return data
      } catch (err) {
        console.error('[useAuth.signUpMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (data) => {
      log('[useAuth.signUpMutation] onSuccess called:', data)
      if (data?.user) {
        log('[useAuth.signUpMutation] Setting current user...')
        const user = data.user as any; // Type assertion for user_metadata
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          university: user.user_metadata?.university || '',
          avatar: user.user_metadata?.avatar,
          verified: false
        })
        log('[useAuth.signUpMutation] Current user set')
      }
    },
    onError: (error) => {
      console.error('[useAuth.signUpMutation] onError:', error)
      setError(error instanceof Error ? error.message : 'Sign up failed. Please try again.')
    }
  })

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      log('[useAuth.signInMutation] Starting signin...', { email })
      clearError() // Clear any previous errors
      
      try {
        log('[useAuth.signInMutation] Calling auth.signIn...')
        const { data, error } = await auth.signIn(email, password)
        
        if (error) {
          console.error('[useAuth.signInMutation] Auth signin error:', error)
          
          // Provide user-friendly error messages
          let errorMessage = 'Sign in failed. Please try again.';
          
          const errorMessageStr = (error as any)?.message || '';
          
          if (errorMessageStr.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (errorMessageStr.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account.';
          } else if (errorMessageStr) {
            errorMessage = errorMessageStr;
          }
          
          throw new Error(errorMessage);
        }
        
        log('[useAuth.signInMutation] Auth signin successful:', data)
        return data
      } catch (err) {
        console.error('[useAuth.signInMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: (data) => {
      log('[useAuth.signInMutation] onSuccess called:', data)
      if (data?.user) {
        log('[useAuth.signInMutation] Setting current user...')
        const user = data.user as any; // Type assertion for user_metadata
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          university: user.user_metadata?.university || '',
          avatar: user.user_metadata?.avatar,
          verified: false
        })
        log('[useAuth.signInMutation] Current user set')
      }
    },
    onError: (error) => {
      console.error('[useAuth.signInMutation] onError:', error)
      setError(error instanceof Error ? error.message : 'Sign in failed. Please try again.')
    }
  })

  const signOutMutation = useMutation({
    mutationFn: async () => {
      log('[useAuth.signOutMutation] Starting signout...')
      clearError() // Clear any previous errors
      
      try {
        log('[useAuth.signOutMutation] Calling auth.signOut...')
        const { error } = await auth.signOut()
        
        if (error) {
          console.error('[useAuth.signOutMutation] Auth signout error:', error)
          throw new Error('Sign out failed. Please try again.');
        }
        
        log('[useAuth.signOutMutation] Auth signout successful')
        return true
      } catch (err) {
        console.error('[useAuth.signOutMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: () => {
      log('[useAuth.signOutMutation] onSuccess called')
      setCurrentUser(null)
      log('[useAuth.signOutMutation] Current user cleared')
    },
    onError: (error) => {
      console.error('[useAuth.signOutMutation] onError:', error)
      setError(error instanceof Error ? error.message : 'Sign out failed. Please try again.')
    }
  })

  return {
    currentUser,
    isLoading,
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  }
} 
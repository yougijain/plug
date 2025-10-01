import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, createContext, useContext, ReactNode, useState } from 'react'
import { auth } from '../lib/supabase'
import { userApi } from '../lib/api'
import { useAppStore } from '../lib/store'
import type { User } from '../types'

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

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [AuthProvider] Loading timeout reached, forcing loading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 [AuthProvider] Starting auth check...');
        const result = await auth.getCurrentUser();
        console.log('🔍 [AuthProvider] Auth result:', result);
        
        if (result && 'user' in result && result.user) {
          const user = result.user as any;
          console.log('🔍 [AuthProvider] User found:', user.email);
          
          // Gate access until email verified
          if (user.email_confirmed_at) {
            console.log('🔍 [AuthProvider] Email confirmed, fetching user profile...');
            try {
              // Fetch full user profile from database
              const fullUser = await userApi.getCurrentUser();
              if (fullUser) {
                console.log('✅ [AuthProvider] User profile loaded:', fullUser.name);
                setCurrentUser(fullUser);
              } else {
                console.log('⚠️ [AuthProvider] No user profile found in database');
                setCurrentUser(null);
              }
            } catch (profileError) {
              console.error('❌ [AuthProvider] Failed to fetch user profile:', profileError);
              setCurrentUser(null);
            }
          } else {
            console.log('⚠️ [AuthProvider] Email not confirmed');
            setCurrentUser(null);
          }
        } else {
          console.log('🔍 [AuthProvider] No authenticated user');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Auth check failed:', error);
        setCurrentUser(null);
      } finally {
        console.log('✅ [AuthProvider] Auth check complete, setting loading to false');
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const subscription = auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('🔍 [AuthProvider] Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user as any;
          if (user.email_confirmed_at) {
            try {
              // Fetch full user profile from database
              const fullUser = await userApi.getCurrentUser();
              if (fullUser) {
                console.log('✅ [AuthProvider] User signed in:', fullUser.name);
                setCurrentUser(fullUser);
              } else {
                console.log('⚠️ [AuthProvider] No user profile found after sign in');
                setCurrentUser(null);
              }
            } catch (profileError) {
              console.error('❌ [AuthProvider] Failed to fetch user profile after sign in:', profileError);
              setCurrentUser(null);
            }
          } else {
            console.log('⚠️ [AuthProvider] Email not confirmed after sign in');
            setCurrentUser(null);
          }
        }
        if (event === 'SIGNED_OUT') {
          console.log('🔍 [AuthProvider] User signed out');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('❌ [AuthProvider] Auth state change handling failed:', err);
        setCurrentUser(null);
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
      userData: {
        email: string
        name: string
        university: string
        campus_id: string
        date_of_birth: string
        avatar?: string
      }
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
          
          // Special case: Supabase rate-limits verification email resends
          // Message often looks like: "For security reasons/purposes, you can only request this after XX seconds."
          if (errorMessageStr.toLowerCase().includes('for security') ||
              errorMessageStr.toLowerCase().includes('request this after')) {
            console.warn('⚠️ [useAuth.signUpMutation] Verification recently sent (rate limited). Treating as success.')
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
        
        console.log('✅ [useAuth.signUpMutation] Auth signup successful:', data)
        
        // Create user profile with auth uid to satisfy RLS
        if (data?.user) {
          console.log('🔍 [useAuth.signUpMutation] Creating user profile...')
          await userApi.createUser({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            university: userData.university,
            campus_id: userData.campus_id,
            date_of_birth: userData.date_of_birth,
            avatar: userData.avatar
          })
          console.log('✅ [useAuth.signUpMutation] User profile created')
        }
        
        return data
      } catch (err) {
        console.error('❌ [useAuth.signUpMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: async (data) => {
      console.log('🔍 [useAuth.signUpMutation] onSuccess called:', data)
      if (data?.user) {
        console.log('🔍 [useAuth.signUpMutation] Fetching full user profile...')
        try {
          // Fetch full user profile from database
          const fullUser = await userApi.getCurrentUser();
          if (fullUser) {
            setCurrentUser(fullUser);
            console.log('✅ [useAuth.signUpMutation] Current user set')
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
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
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (errorMessageStr.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account.';
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
    onSuccess: async (data) => {
      console.log('🔍 [useAuth.signInMutation] onSuccess called:', data)
      if (data?.user) {
        console.log('🔍 [useAuth.signInMutation] Fetching full user profile...')
        try {
          // Fetch full user profile from database
          const fullUser = await userApi.getCurrentUser();
          if (fullUser) {
            setCurrentUser(fullUser);
            console.log('✅ [useAuth.signInMutation] Current user set')
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
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
      clearError() // Clear any previous errors
      
      try {
        console.log('🔍 [useAuth.signOutMutation] Calling auth.signOut...')
        const { error } = await auth.signOut()
        
        if (error) {
          console.error('❌ [useAuth.signOutMutation] Auth signout error:', error)
          throw new Error('Sign out failed. Please try again.');
        }
        
        console.log('✅ [useAuth.signOutMutation] Auth signout successful')
        return true
      } catch (err) {
        console.error('❌ [useAuth.signOutMutation] Exception:', err)
        throw err
      }
    },
    onSuccess: () => {
      console.log('🔍 [useAuth.signOutMutation] onSuccess called')
      setCurrentUser(null)
      console.log('✅ [useAuth.signOutMutation] Current user cleared')
    },
    onError: (error) => {
      console.error('❌ [useAuth.signOutMutation] onError:', error)
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
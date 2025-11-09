import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, createContext, useContext, ReactNode, useState } from 'react'
import { auth } from '../lib/supabase'
import { userApi } from '../lib/api'
import { useAppStore } from '../lib/store'
import type { User } from '../types'

const extractMetadataValue = (metadata: Record<string, any>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = metadata?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return undefined
}

const ensureUserProfile = async (
  supabaseUser: any,
  setCurrentUser: (user: User | null) => void,
  setError?: (message: string) => void
) => {
  if (!supabaseUser?.id) {
    return
  }

  if (!supabaseUser.email_confirmed_at) {
    setCurrentUser(null)
    setError?.('Please confirm your email before signing in.')
    return
  }

  try {
    const existingUser = await userApi.getCurrentUser()
    if (existingUser) {
      setCurrentUser(existingUser)
      return
    }
  } catch (err) {
    console.error('Failed to load existing user profile:', err)
  }

  const metadata = supabaseUser.user_metadata || {}

  const campusId =
    extractMetadataValue(metadata, ['campus_id', 'campusId', 'campusid']) ||
    (typeof metadata.campus === 'string' ? metadata.campus : metadata.campus?.id)

  const name =
    extractMetadataValue(metadata, ['name', 'full_name', 'fullName']) ||
    (supabaseUser.email ? supabaseUser.email.split('@')[0] : 'Student')

  const university =
    extractMetadataValue(metadata, ['university', 'school', 'campus_name', 'campusName']) || ''

  const dateOfBirth =
    extractMetadataValue(metadata, ['date_of_birth', 'dateOfBirth', 'dob']) || ''

  const avatar =
    extractMetadataValue(metadata, ['avatar', 'avatar_url', 'avatarUrl', 'profile_image']) || undefined

  if (!campusId || !dateOfBirth) {
    const message =
      'We could not find your campus or profile information. Please complete sign up again to continue.'
    setError?.(message)
    setCurrentUser(null)
    return
  }

  try {
    const createdUser = await userApi.createUser({
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name,
      university,
      campus_id: campusId,
      date_of_birth: dateOfBirth,
      avatar,
    })
    setCurrentUser(createdUser)
  } catch (err) {
    console.error('Failed to backfill user profile:', err)
    setError?.('We were unable to load your profile. Please try again or contact support.')
    setCurrentUser(null)
  }
}

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
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await auth.getCurrentUser();
        
        if (result && 'user' in result && result.user) {
          await ensureUserProfile(result.user, setCurrentUser)
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const subscription = auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserProfile(session.user, setCurrentUser)
        }
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Refresh user profile when token is refreshed
          await ensureUserProfile(session.user, setCurrentUser)
        }
      } catch (err) {
        console.error('Auth state change handling failed:', err);
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
      clearError() // Clear any previous errors
      
      try {
        const { data, error } = await auth.signUp(email, password, userData)
        
        if (error) {
          // Provide user-friendly error messages
          let errorMessage = 'Sign up failed. Please try again.';
          
          const errorMessageStr = (error as any)?.message || '';
          
          // Special case: Supabase rate-limits verification email resends
          // Message often looks like: "For security reasons/purposes, you can only request this after XX seconds."
          if (errorMessageStr.toLowerCase().includes('for security') ||
              errorMessageStr.toLowerCase().includes('request this after')) {
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
        
        // Create user profile with auth uid to satisfy RLS
        if (data?.user) {
          await userApi.createUser({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            university: userData.university,
            campus_id: userData.campus_id,
            date_of_birth: userData.date_of_birth,
            avatar: userData.avatar
          })
        }
        
        return data
      } catch (err) {
        console.error('Sign up exception:', err)
        throw err
      }
    },
    onSuccess: async (data) => {
      if (data?.user) {
        try {
          // Fetch full user profile from database
          const fullUser = await userApi.getCurrentUser();
          if (fullUser) {
            setCurrentUser(fullUser);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error)
      setError(error instanceof Error ? error.message : 'Sign up failed. Please try again.')
    }
  })

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      clearError() // Clear any previous errors
      
      try {
        const { data, error } = await auth.signIn(email, password)
        
        if (error) {
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
        
        return data
      } catch (err) {
        console.error('Sign in exception:', err)
        throw err
      }
    },
    onSuccess: async (data) => {
      // Immediately handle sign-in success
      if (data?.user) {
        await ensureUserProfile(data.user, setCurrentUser, setError)
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error)
      setError(error instanceof Error ? error.message : 'Sign in failed. Please try again.')
    }
  })

  const signOutMutation = useMutation({
    mutationFn: async () => {
      clearError() // Clear any previous errors
      
      try {
        const { error } = await auth.signOut()
        
        if (error) {
          console.error('Sign out error:', (error as any)?.message || error)
          throw new Error('Sign out failed. Please try again.');
        }
        
        return true
      } catch (err) {
        console.error('Sign out exception:', err)
        throw err
      }
    },
    onSuccess: () => {
      setCurrentUser(null)
    },
    onError: (error) => {
      console.error('Sign out error:', error)
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
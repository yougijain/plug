import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../lib/store';
import TwoFactorAuth from '../components/TwoFactorAuth';
import { auth } from '../lib/supabase';
import { isDemoMode } from '../lib/env';
import { LogoIcon } from '../components/SVGIcon';
import { log } from '../lib/logger'

const ALLOWED_UNIVERSITIES = ['Purdue University', 'Indiana University'] as const;

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  university: z
    .string()
    .min(1, 'Please select your university')
    .refine((val) => (ALLOWED_UNIVERSITIES as readonly string[]).includes(val), {
      message: 'Please select your university',
    }),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  // Keep minimal state; success banner is implicit by switching modes
  const [show2FA, setShow2FA] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isResending2FA, setIsResending2FA] = useState(false);
  const [twoFAError, setTwoFAError] = useState('');
  const [isEnteringDemo, setIsEnteringDemo] = useState(false);
  const { signUp, signIn, isSigningUp, isSigningIn } = useAuth();
  const { error, clearError, setCurrentUser } = useAppStore();

  // Demo mode: skip the sign-up wall entirely so the deployed app is explorable.
  const handleEnterDemo = async () => {
    clearError();
    setIsEnteringDemo(true);
    try {
      const { data, error: demoError } = await auth.enterDemo();
      if (demoError || !data?.user) throw new Error(demoError?.message || 'Could not start the demo.');
      const user = data.user;
      setCurrentUser({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Demo Student',
        university: user.user_metadata?.university || '',
        avatar: user.user_metadata?.avatar,
        verified: true,
      });
    } catch (err) {
      log('[Login] demo entry failed:', err);
      setIsEnteringDemo(false);
    }
  };

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSignUp = async (data: SignUpForm) => {
    clearError();
    // no-op
    
    try {
      log('🔍 [Login] Starting sign up process...', { email: data.email, university: data.university });
      
      await signUp({
        email: data.email,
        password: data.password,
        userData: {
          name: data.name,
          email: data.email,
          university: data.university,
          avatar: undefined,
        },
      });
      
      log('✅ [Login] Sign up successful!');
      // Even if Supabase rate-limited a resend, we consider it success and show the banner
      // show implicit success by switching modes after delay
      
      // Also surface a small inline info banner at top of the form
      // by leveraging the existing success banner location
      // already handled by mode switch
      
      // Clear form after successful sign up
      signUpForm.reset();
      
      // Show success message for 3 seconds, then switch to sign in
      setTimeout(() => {
        setIsSignUp(false);
      }, 2000);
      
    } catch (err) {
      console.error('❌ [Login] Sign up failed:', err);
      // If error contains Supabase security rate limit string, show verification-sent success instead
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      if (msg.includes('for security') || msg.includes('request this after')) {
        setTimeout(() => setIsSignUp(false), 1500)
      }
      // Error will still be handled by the useAuth hook via global error state
    }
  };

  const onSignIn = async (data: SignInForm) => {
    clearError();
    
    try {
      log('🔍 [Login] Starting sign in process...', { email: data.email });
      
      await signIn({
        email: data.email,
        password: data.password,
      });
      
      log('✅ [Login] Sign in successful!');
      
    } catch (err) {
      console.error('❌ [Login] Sign in failed:', err);
      
      // Check if this is a 2FA required error
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('2FA') || errorMessage.includes('verification') || errorMessage.includes('factor')) {
        setPendingEmail(data.email);
        setShow2FA(true);
      }
      // Error will be handled by the useAuth hook and displayed in the error state
    }
  };

  const handle2FAVerify = async (code: string) => {
    setIsVerifying2FA(true);
    setTwoFAError('');
    
    try {
      // Here you would typically call your 2FA verification API
      // For now, we'll simulate the verification
      log('🔍 [Login] Verifying 2FA code:', code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      if (code.length === 6) {
        log('✅ [Login] 2FA verification successful!');
        setShow2FA(false);
        // Continue with sign in process
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err) {
      console.error('❌ [Login] 2FA verification failed:', err);
      setTwoFAError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handle2FAResend = async () => {
    setIsResending2FA(true);
    setTwoFAError('');
    
    try {
      // Here you would typically call your resend verification API
      log('🔍 [Login] Resending 2FA code to:', pendingEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      log('✅ [Login] 2FA code resent successfully!');
    } catch (err) {
      console.error('❌ [Login] Failed to resend 2FA code:', err);
      setTwoFAError('Failed to resend code. Please try again.');
    } finally {
      setIsResending2FA(false);
    }
  };

  const handle2FACancel = () => {
    setShow2FA(false);
    setPendingEmail('');
    setTwoFAError('');
    clearError();
  };

  const handleModeSwitch = (newMode: boolean) => {
    if (newMode && !isSignUp) {
      // Switching from sign in to sign up - transfer email
      const signInEmail = signInForm.getValues('email');
      if (signInEmail) {
        signUpForm.setValue('email', signInEmail);
      }
    } else if (!newMode && isSignUp) {
      // Switching from sign up to sign in - transfer email
      const signUpEmail = signUpForm.getValues('email');
      if (signUpEmail) {
        signInForm.setValue('email', signUpEmail);
      }
    }
    setIsSignUp(newMode);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-lightBlue-100 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0E1F33]">
              <LogoIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Welcome to Plug</h1>
            <p className="text-dark-600">Buy and sell with verified students on your campus</p>
          </div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 rounded-xl border border-[#FFD8C4] bg-[#FFF6F1] p-4"
            >
              <p className="text-sm font-semibold text-[#0E1F33]">Just looking around?</p>
              <p className="mt-1 text-xs leading-relaxed text-[#6B7A8C]">
                Enter as a demo student with a seeded campus feed — no email, no password.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnterDemo}
                disabled={isEnteringDemo}
                className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#FF6B35] py-3 font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60"
              >
                {isEnteringDemo ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Opening demo...
                  </>
                ) : (
                  'Explore the demo'
                )}
              </motion.button>
              <p className="mt-3 text-center text-[11px] text-[#9AA5B1]">
                or sign in below — in demo mode any .edu address works
              </p>
            </motion.div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-600 text-sm">{error}</p>
            </div>
          )}

        {/* Removed visible post-signup banner to keep flow minimal; app requires verified email */}

          <motion.div 
            className="flex mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSwitch(false)}
              className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
                !isSignUp
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 text-dark-600 hover:bg-neutral-200'
              }`}
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSwitch(true)}
              className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
                isSignUp
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 text-dark-600 hover:bg-neutral-200'
              }`}
            >
              Sign Up
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.form 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={signUpForm.handleSubmit(onSignUp)} 
                className="space-y-4"
              >
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...signUpForm.register('name')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signUpForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  University
                </label>
                <select
                  {...signUpForm.register('university')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your university</option>
                  <option value="Purdue University">Purdue University</option>
                  <option value="Indiana University">Indiana University</option>
                </select>
                {signUpForm.formState.errors.university && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signUpForm.formState.errors.university.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...signUpForm.register('email')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...signUpForm.register('password')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningUp ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form 
              key="signin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={signInForm.handleSubmit(onSignIn)} 
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...signInForm.register('email')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {signInForm.formState.errors.email && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...signInForm.register('password')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                {signInForm.formState.errors.password && (
                  <p className="text-orange-500 text-xs mt-1">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningIn ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.form>
          )}
          </AnimatePresence>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-sm text-dark-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModeSwitch(!isSignUp)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FA && (
          <TwoFactorAuth
            email={pendingEmail}
            onVerify={handle2FAVerify}
            onResend={handle2FAResend}
            onCancel={handle2FACancel}
            isVerifying={isVerifying2FA}
            isResending={isResending2FA}
            error={twoFAError}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Login; 
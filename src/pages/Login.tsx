import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../lib/store';

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
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { signUp, signIn, isSigningUp, isSigningIn } = useAuth();
  const { error, clearError } = useAppStore();

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSignUp = async (data: SignUpForm) => {
    clearError();
    setSignUpSuccess(false);
    
    try {
      console.log('🔍 [Login] Starting sign up process...', { email: data.email, university: data.university });
      
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
      
      console.log('✅ [Login] Sign up successful!');
      setSignUpSuccess(true);
      
      // Clear form after successful sign up
      signUpForm.reset();
      
      // Show success message for 3 seconds, then switch to sign in
      setTimeout(() => {
        setSignUpSuccess(false);
        setIsSignUp(false);
      }, 3000);
      
    } catch (err) {
      console.error('❌ [Login] Sign up failed:', err);
      // Error will be handled by the useAuth hook and displayed in the error state
    }
  };

  const onSignIn = async (data: SignInForm) => {
    clearError();
    
    try {
      console.log('🔍 [Login] Starting sign in process...', { email: data.email });
      
      await signIn({
        email: data.email,
        password: data.password,
      });
      
      console.log('✅ [Login] Sign in successful!');
      
    } catch (err) {
      console.error('❌ [Login] Sign in failed:', err);
      // Error will be handled by the useAuth hook and displayed in the error state
    }
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
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Welcome to Loop</h1>
          <p className="text-dark-600">Connect with your university community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-600 text-sm">{error}</p>
          </div>
        )}

        {signUpSuccess && (
          <div className="mb-6 p-4 bg-lightBlue-50 border border-lightBlue-200 rounded-lg">
            <p className="text-blue-600 text-sm">Account created successfully!</p>
          </div>
        )}

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
  );
};

export default Login; 
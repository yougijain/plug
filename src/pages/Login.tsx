import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCampuses } from '../hooks/useCampuses';
import { useAppStore } from '../lib/store';

// Validation: Must be .edu email
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('.edu'), {
      message: 'Must be a .edu email address'
    }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  campus_id: z.string().min(1, 'Please select your campus'),
  date_of_birth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 17;
      }
      return age >= 17;
    }, { message: 'You must be at least 17 years old to use Campus Connect' }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  })
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, signIn, isSigningUp, isSigningIn } = useAuth();
  const { error, clearError } = useAppStore();
  const { campuses, isLoading: isCampusesLoading, error: campusesError } = useCampuses();
  

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  // Extract campus from email and auto-select if available
  const watchEmail = signUpForm.watch('email');
  React.useEffect(() => {
    if (watchEmail && watchEmail.includes('@')) {
      const domain = watchEmail.split('@')[1]?.toLowerCase();
      if (domain && domain.endsWith('.edu')) {
        const matchingCampus = campuses.find(c => c.domain === domain);
        if (matchingCampus) {
          signUpForm.setValue('campus_id', matchingCampus.id);
        }
      }
    }
  }, [watchEmail, campuses, signUpForm]);

  const onSignUp = async (data: SignUpForm) => {
    clearError();
    
    try {
      const campus = campuses.find(c => c.id === data.campus_id);
      
      await signUp({
        email: data.email,
        password: data.password,
        userData: {
          email: data.email,
          name: data.name,
          university: campus?.name || '',
          campus_id: data.campus_id,
          date_of_birth: data.date_of_birth,
          avatar: undefined,
        },
      });
      
      // Show success and switch to sign in
      signUpForm.reset();
      setTimeout(() => {
        setIsSignUp(false);
      }, 2000);
      
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  const onSignIn = async (data: SignInForm) => {
    clearError();
    
    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleModeSwitch = (newMode: boolean) => {
    if (newMode && !isSignUp) {
      const signInEmail = signInForm.getValues('email');
      if (signInEmail) {
        signUpForm.setValue('email', signInEmail);
      }
    } else if (!newMode && isSignUp) {
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4"
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
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-3xl">🎟️</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Campus Connect
          </h1>
          <p className="text-gray-600">Buy and sell tickets on your campus</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
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
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...signUpForm.register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  .edu Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...signUpForm.register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your.name@university.edu"
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  You must use your university .edu email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campus <span className="text-red-500">*</span>
                </label>
                <select
                  {...signUpForm.register('campus_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isCampusesLoading}
                >
                  <option value="">
                    {isCampusesLoading 
                      ? 'Loading campuses...' 
                      : campusesError 
                        ? 'Error loading campuses' 
                        : 'Select your campus'
                    }
                  </option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
                {campusesError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">Failed to load campuses</p>
                    <p className="text-red-500 text-xs mt-1">
                      Please refresh the page or try again. If the problem persists, contact support.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Refresh Page
                    </button>
                  </div>
                )}
                {signUpForm.formState.errors.campus_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.campus_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...signUpForm.register('date_of_birth')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                />
                {signUpForm.formState.errors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.date_of_birth.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...signUpForm.register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Create a secure password"
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  {...signUpForm.register('agreeTerms')}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              {signUpForm.formState.errors.agreeTerms && (
                <p className="text-red-500 text-xs">
                  {signUpForm.formState.errors.agreeTerms.message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...signInForm.register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your.name@university.edu"
                />
                {signInForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...signInForm.register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                {signInForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeSwitch(!isSignUp)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </p>
        </motion.div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Questions? Email{' '}
            <a href="mailto:support@campusconnect.app" className="text-indigo-600 hover:underline">
              support@campusconnect.app
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;

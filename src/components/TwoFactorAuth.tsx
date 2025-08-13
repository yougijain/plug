import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface TwoFactorAuthProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
  isVerifying?: boolean;
  isResending?: boolean;
  error?: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  email,
  onVerify,
  onResend,
  onCancel,
  isVerifying = false,
  isResending = false,
  error
}) => {
  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0); // Start at 0 so resend is immediately available
  const [canResend, setCanResend] = useState(true); // Start as true
  const [emailSent, setEmailSent] = useState(true);
  // const [hasAttemptedResend, setHasAttemptedResend] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeRemaining]);

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await onResend();
      setTimeRemaining(57);
      setCanResend(false);
      setEmailSent(true);
      // setHasAttemptedResend(true);
    } catch (err) {
      console.error('Failed to resend verification code:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <EnvelopeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Email Sent Success Message - Show when emailSent is true and no error */}
        <AnimatePresence>
          {emailSent && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm">Email verification has been sent</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
              placeholder="000000"
              maxLength={6}
              disabled={isVerifying}
            />
          </div>

          <button
            type="submit"
            disabled={code.length !== 6 || isVerifying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              <p>For security reasons, you can only request this every 57 seconds</p>
              <p className="mt-1">
                Try again in <span className="font-medium">{timeRemaining}</span> seconds
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="w-full text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TwoFactorAuth;

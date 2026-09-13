import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitPullRequest, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function GitHubSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [statusMessage, setStatusMessage] = useState('Authenticating with GitHub...');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');

      // If token is missing from URL query parameter, redirect to /login
      if (!token) {
        console.error('GitHub OAuth error: Token is missing in URL');
        setHasError(true);
        setStatusMessage('Authentication token missing. Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
        return;
      }

      try {
        setStatusMessage('Verifying user profile...');

        // Fetch the authenticated user profile using existing profile API
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        // Check if response is successful and user profile is returned
        if (!response.ok || !data.user) {
          throw new Error(data.message || 'Profile verification failed');
        }

        await login(token, data.user);

        setStatusMessage('Authentication successful! Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 600);

      } catch (error) {
        console.error('GitHub authentication failed:', error);
        setHasError(true);
        setStatusMessage('Failed to authenticate profile. Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
    };

    handleAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-panel p-8 sm:p-12 rounded-3xl border ${
          hasError ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10'
        } text-center flex flex-col items-center max-w-md w-full shadow-2xl`}
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
            {hasError ? (
              <AlertCircle className="w-8 h-8 text-rose-400" />
            ) : (
              <GitPullRequest className="w-8 h-8 text-orange-500 animate-pulse" />
            )}
          </div>
          {!hasError && (
            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-orange-500/40">
              <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          {hasError ? 'Authentication Failed' : 'Signing You In'}
        </h2>

        <p className="text-sm font-data-mono text-white/60 leading-relaxed">
          {statusMessage}
        </p>
      </motion.div>
    </div>
  );
}

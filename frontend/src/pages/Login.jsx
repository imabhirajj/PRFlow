/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitPullRequest, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setDemoStatus({
        type: 'error',
        message: 'Please fill in both email and password fields.'
      });
      return;
    }

    setIsLoading(true);
    setDemoStatus(null);

    // Mock UI delay to showcase interactive experience without backend/API
    setTimeout(() => {
      setIsLoading(false);
      setDemoStatus({
        type: 'success',
        message: 'Demo UI: Login action simulated successfully! (Frontend-only mode)'
      });
    }, 1000);
  };

  const handleOAuthClick = (provider) => {
    setDemoStatus({
      type: 'info',
      message: `Demo UI: ${provider} sign-in button clicked (Frontend-only mode).`
    });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus(true);
    setTimeout(() => {
      setForgotStatus(false);
      setShowForgotPasswordModal(false);
      setForgotEmail('');
      setDemoStatus({
        type: 'success',
        message: 'Demo UI: Password reset instructions simulated.'
      });
    }, 1500);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 px-4 relative">
      {/* Decorative background ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to explore/home link */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mb-6 flex items-center justify-between"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-data-mono text-white/50 hover:text-orange-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to PRFlow Home
        </Link>
        <span className="text-xs font-data-mono text-white/30">UI Preview</span>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Top gradient edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-500/60 to-transparent" />

        {/* Card Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 orange-glow">
            <GitPullRequest className="w-7 h-7 text-orange-500" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-data-mono uppercase tracking-wider text-orange-400 font-semibold">
              Contributor Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 font-h1">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 max-w-xs">
            Log in to continue exploring open source issues and tracking your contributions.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthClick('GitHub')}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <GithubIcon className="w-5 h-5 text-white" />
            <span>Continue with GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthClick('Google')}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-white/10" />
          <span className="bg-[#131315] px-3 font-data-mono text-xs uppercase tracking-wider text-white/40 absolute">
            or with email
          </span>
        </div>

        {/* Demo Status Banner */}
        <AnimatePresence>
          {demoStatus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 rounded-xl mb-5 text-xs font-data-mono border flex items-start gap-2.5 ${
                demoStatus.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : demoStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{demoStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label 
              htmlFor="login-email" 
              className="block text-xs font-data-mono uppercase tracking-wider text-white/70 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@prflow.dev"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label 
                htmlFor="login-password" 
                className="block text-xs font-data-mono uppercase tracking-wider text-white/70"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs font-data-mono text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all font-data-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-orange-500/30 focus:ring-offset-0 cursor-pointer accent-orange-500"
            />
            <label 
              htmlFor="remember-me" 
              className="text-xs text-white/70 cursor-pointer select-none font-medium"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bitcoin-gradient px-6 py-3.5 rounded-xl text-black font-bold uppercase text-xs tracking-widest orange-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to PRFlow</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            Don&apos;t have an account yet?{' '}
            <Link 
              to="/signup" 
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Modal (pure frontend mock) */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/15 shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white mb-1 font-h2">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your registered email address and we will simulate sending a reset link.
              </p>
              
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="dev@prflow.dev"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm outline-none focus:border-orange-500"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-xs text-white/70 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus}
                    className="bitcoin-gradient px-4 py-2 rounded-lg text-black font-bold text-xs cursor-pointer"
                  >
                    {forgotStatus ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

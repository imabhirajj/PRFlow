/* eslint-disable no-unused-vars */
import { useState, useMemo } from 'react';
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
  User, 
  ArrowLeft, 
  Check 
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Signup() {
  const [name, setName] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState(null);

  // Password strength calculation purely for UI feedback
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLen: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password)
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (passwordCriteria.hasMinLen) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasSpecial) score += 1;
    return score;
  }, [password, passwordCriteria]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: 'None', color: 'text-white/40' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'text-rose-400' };
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-400' };
    if (strengthScore === 3) return { text: 'Good', color: 'text-blue-400' };
    return { text: 'Strong', color: 'text-emerald-400' };
  }, [password, strengthScore]);

  const passwordsMatch = useMemo(() => {
    return password && confirmPassword && password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setDemoStatus({
        type: 'error',
        message: 'Please agree to the Terms of Service & Privacy Policy to continue.'
      });
      return;
    }

    if (password !== confirmPassword) {
      setDemoStatus({
        type: 'error',
        message: 'Passwords do not match. Please verify and try again.'
      });
      return;
    }

    setIsLoading(true);
    setDemoStatus(null);

    // Simulated UI delay for mock demonstration
    setTimeout(() => {
      setIsLoading(false);
      setDemoStatus({
        type: 'success',
        message: 'Demo UI: Account creation simulated successfully! (Frontend-only mode)'
      });
    }, 1200);
  };

  const handleOAuthClick = (provider) => {
    setDemoStatus({
      type: 'info',
      message: `Demo UI: ${provider} sign-up initiated (Frontend-only mode).`
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 px-4 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation Row */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mb-6 flex items-center justify-between"
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

      {/* Centered Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Top highlight bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-500/60 to-transparent" />

        {/* Card Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 orange-glow">
            <GitPullRequest className="w-7 h-7 text-orange-500" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] font-data-mono uppercase tracking-wider text-orange-400 font-semibold">
              Get Started
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2 font-h1">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-400 max-w-xs">
            Start your developer journey and make your first open-source contributions.
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthClick('GitHub')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span>Sign up with GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthClick('Google')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-white/10" />
          <span className="bg-[#131315] px-3 font-data-mono text-xs uppercase tracking-wider text-white/40 absolute">
            or register with email
          </span>
        </div>

        {/* Status Message */}
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and GitHub row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="signup-name" 
                className="block text-xs font-data-mono uppercase tracking-wider text-white/70 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Developer"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="signup-github" 
                className="flex items-center justify-between text-xs font-data-mono uppercase tracking-wider text-white/70 mb-2"
              >
                <span>GitHub Handle</span>
                <span className="text-[10px] text-white/40 font-normal lowercase">optional</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <input
                  id="signup-github"
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  placeholder="octocat"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all font-data-mono"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label 
              htmlFor="signup-email" 
              className="block text-xs font-data-mono uppercase tracking-wider text-white/70 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label 
                htmlFor="signup-password" 
                className="block text-xs font-data-mono uppercase tracking-wider text-white/70"
              >
                Password
              </label>
              {password && (
                <span className={`text-xs font-data-mono font-medium ${strengthLabel.color}`}>
                  Strength: {strengthLabel.text}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all font-data-mono"
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

            {/* Password Strength Bars */}
            {password && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-4 gap-1.5 h-1">
                  <div 
                    className={`h-full rounded-full transition-colors ${
                      strengthScore >= 1 ? 'bg-orange-500' : 'bg-white/10'
                    }`} 
                  />
                  <div 
                    className={`h-full rounded-full transition-colors ${
                      strengthScore >= 2 ? 'bg-orange-500' : 'bg-white/10'
                    }`} 
                  />
                  <div 
                    className={`h-full rounded-full transition-colors ${
                      strengthScore >= 3 ? 'bg-amber-400' : 'bg-white/10'
                    }`} 
                  />
                  <div 
                    className={`h-full rounded-full transition-colors ${
                      strengthScore >= 4 ? 'bg-emerald-400' : 'bg-white/10'
                    }`} 
                  />
                </div>
                
                {/* Criteria hints */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] font-data-mono">
                  <span className={passwordCriteria.hasMinLen ? 'text-emerald-400' : 'text-white/40'}>
                    {passwordCriteria.hasMinLen ? '✓' : '•'} 8+ chars
                  </span>
                  <span className={passwordCriteria.hasNumber ? 'text-emerald-400' : 'text-white/40'}>
                    {passwordCriteria.hasNumber ? '✓' : '•'} 1 number
                  </span>
                  <span className={passwordCriteria.hasUpper ? 'text-emerald-400' : 'text-white/40'}>
                    {passwordCriteria.hasUpper ? '✓' : '•'} 1 uppercase
                  </span>
                  <span className={passwordCriteria.hasSpecial ? 'text-emerald-400' : 'text-white/40'}>
                    {passwordCriteria.hasSpecial ? '✓' : '•'} 1 symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label 
                htmlFor="signup-confirm-password" 
                className="block text-xs font-data-mono uppercase tracking-wider text-white/70"
              >
                Confirm Password
              </label>
              {confirmPassword && (
                <span className={`text-[11px] font-data-mono ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✕ Must match password'}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-rose-500/50 focus:border-rose-500' 
                    : 'border-white/15 focus:border-orange-500/70'
                } focus:ring-1 focus:ring-orange-500/40 text-white placeholder-white/25 text-sm outline-none transition-all font-data-mono`}
              />
              {passwordsMatch && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <div className="flex items-start gap-2.5">
              <input
                id="terms-agree"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-orange-500/30 focus:ring-offset-0 cursor-pointer accent-orange-500"
              />
              <label 
                htmlFor="terms-agree" 
                className="text-xs text-white/70 cursor-pointer select-none leading-relaxed"
              >
                I agree to the{' '}
                <a href="#terms" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bitcoin-gradient px-6 py-3.5 rounded-xl text-black font-bold uppercase text-xs tracking-widest orange-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create PRFlow Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  AlertCircle, 
  Loader2, 
  GitPullRequest, 
  ArrowLeft,
  IdCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  FolderGit2,
  Sparkles,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [contributions, setContributions] = useState([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'Started' | 'Completed'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const fetchContributions = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoadingContributions(true);
      setError(null);

      const res = await fetch(API_ENDPOINTS.PROGRESS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to load contributions');
      }

      const data = await res.json();
      setContributions(data.progress || []);
    } catch (err) {
      console.error('Contributions error:', err);
      setError('Unable to load your contribution progress.');
    } finally {
      setIsLoadingContributions(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'Started' ? 'Completed' : 'Started';
    try {
      setActionLoadingId(item._id);
      const res = await fetch(API_ENDPOINTS.PROGRESS.BY_ID(item._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      setContributions(prev =>
        prev.map(c => (c._id === item._id ? data.progress : c))
      );

      setFeedback({
        type: 'success',
        message: `Contribution marked as ${newStatus}!`
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Could not update contribution status.'
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to drop tracking this contribution?')) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await fetch(API_ENDPOINTS.PROGRESS.BY_ID(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete contribution');
      }

      setContributions(prev => prev.filter(c => c._id !== id));
      setFeedback({
        type: 'success',
        message: 'Contribution removed from your dashboard.'
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: 'Could not remove contribution.'
      });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = contributions.length;
    const completed = contributions.filter(c => c.status === 'Completed').length;
    const inProgress = contributions.filter(c => c.status === 'Started').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, rate };
  }, [contributions]);

  const filteredContributions = useMemo(() => {
    if (activeTab === 'all') return contributions;
    return contributions.filter(c => c.status === activeTab);
  }, [contributions, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-white/60 font-data-mono text-sm">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center py-4 sm:py-8 px-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 font-data-mono text-xs uppercase tracking-widest text-white/50 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore More Issues
          </Link>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-data-mono text-xs uppercase tracking-wider hover:bg-orange-500/20 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Find New Issues
          </Link>
        </div>

        {/* Global Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border text-sm font-data-mono flex items-center gap-3 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Identity Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
        >
          <div className="h-24 sm:h-28 bg-linear-to-r from-orange-500/20 via-orange-600/10 to-transparent relative border-b border-white/10 px-6 sm:px-8 pt-4 flex items-start justify-between">
            <div className="absolute top-0 right-0 w-64 h-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-data-mono text-xs uppercase tracking-wider shadow-sm">
              <GitPullRequest className="w-3.5 h-3.5" />
              Open Source Contributor
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/40 text-white/70 hover:text-rose-400 border border-white/10 font-data-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-8 sm:-mt-10 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-black border-2 border-orange-500/50 shadow-[0_0_25px_rgba(247,147,26,0.3)] flex items-center justify-center text-2xl sm:text-3xl font-black text-white shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8 text-orange-500" />}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                    {user.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-data-mono text-orange-400/90 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-data-mono text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Contributor
                </span>
              </div>
            </div>

            {/* Quick Metadata Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-data-mono uppercase text-white/40 block">Email</span>
                  <span className="text-xs font-medium text-white truncate block">{user.email}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-data-mono uppercase text-white/40 block">Member Since</span>
                  <span className="text-xs font-medium text-white truncate block">{formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-data-mono uppercase text-white/40 block">Auth Security</span>
                  <span className="text-xs font-medium text-white truncate block">JWT Verified</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contribution Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-data-mono uppercase text-white/50 tracking-wider">Total Tracked</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{stats.total}</span>
              <FolderGit2 className="w-5 h-5 text-white/40" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
            <span className="text-xs font-data-mono uppercase text-amber-400 tracking-wider">In Progress</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400">{stats.inProgress}</span>
              <Clock className="w-5 h-5 text-amber-400/60" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
            <span className="text-xs font-data-mono uppercase text-emerald-400 tracking-wider">Completed PRs</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400">{stats.completed}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400/60" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 flex flex-col justify-between">
            <span className="text-xs font-data-mono uppercase text-orange-400 tracking-wider">Completion Rate</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-orange-400">{stats.rate}%</span>
              <Sparkles className="w-5 h-5 text-orange-400/60" />
            </div>
          </div>
        </div>

        {/* Contributions Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <GitPullRequest className="w-6 h-6 text-orange-500" />
                My Contributions
              </h2>
              <p className="text-xs text-white/50 font-data-mono mt-1">
                Track and manage your ongoing and completed open-source contributions
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-data-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-orange-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('Started')}
                className={`px-3 py-1.5 rounded-lg text-xs font-data-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'Started'
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setActiveTab('Completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-data-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'Completed'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Completed ({stats.completed})
              </button>
            </div>
          </div>

          {/* Loading Contributions State */}
          {isLoadingContributions && (
            <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
              <p className="text-white/60 font-data-mono text-sm">Fetching your contribution roadmap...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoadingContributions && error && (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center flex flex-col items-center">
              <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
              <p className="text-white/80 text-sm mb-4">{error}</p>
              <button
                onClick={fetchContributions}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-data-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingContributions && !error && filteredContributions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-10 sm:p-14 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                <FolderGit2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {activeTab === 'all'
                  ? 'No contributions tracked yet'
                  : `No ${activeTab === 'Started' ? 'in-progress' : 'completed'} contributions found`}
              </h3>
              <p className="text-sm text-white/50 max-w-md mb-6 font-data-mono leading-relaxed">
                Discover beginner-friendly GitHub issues with high scores, claim them, and watch your contribution streak grow.
              </p>
              <Link
                to="/explore"
                className="bitcoin-gradient px-6 py-3 rounded-full text-black font-bold font-data-mono text-xs uppercase tracking-widest orange-glow hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Explore Issues
              </Link>
            </motion.div>
          )}

          {/* Contributions List */}
          {!isLoadingContributions && !error && filteredContributions.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredContributions.map((item) => {
                  const isCompleted = item.status === 'Completed';
                  const isActionLoading = actionLoadingId === item._id;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                          : 'border-white/10 bg-black/40 hover:border-orange-500/30'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-white/90 font-data-mono text-xs font-semibold">
                              <FolderGit2 className="w-3.5 h-3.5 text-orange-400" />
                              {item.repository}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-data-mono text-[11px] uppercase tracking-wider ${
                                isCompleted
                                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                                  : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  In Progress
                                </>
                              )}
                            </span>

                            <span className="text-[11px] font-data-mono text-white/40">
                              Started {formatDate(item.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white hover:text-orange-400 transition-colors">
                            <a
                              href={item.issueUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 hover:underline"
                            >
                              {item.issueTitle}
                              <ExternalLink className="w-4 h-4 shrink-0 text-white/40" />
                            </a>
                          </h3>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto pt-2 lg:pt-0 border-t border-white/5 lg:border-t-0 w-full lg:w-auto justify-between lg:justify-end">
                          <a
                            href={item.issueUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-data-mono text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            GitHub
                          </a>

                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={isActionLoading}
                            className={`px-3.5 py-1.5 rounded-xl font-data-mono text-xs uppercase tracking-wider inline-flex items-center gap-1.5 border transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                            } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isCompleted ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reopen
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Complete
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={isActionLoading}
                            title="Drop contribution"
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

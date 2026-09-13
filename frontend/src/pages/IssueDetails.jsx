import { useState, useEffect } from 'react';
import { ExternalLink, BookOpen, GitBranch, Rocket, CheckCircle2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';


function getRecommendation(score) {
  if (score >= 8) {
    return {
      heading: 'Great first issue',
      text: 'This looks very beginner-friendly. It is a strong pick if you are starting out.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    };
  }

  if (score >= 5) {
    return {
      heading: 'Good challenge',
      text: 'This issue is beginner-accessible, but it may require a bit more reading before coding.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };
  }

  return {
    heading: 'Try a smaller one first',
    text: 'You can still attempt this, but beginners may want to start with a higher-score issue.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };
}

function getScoreBadgeClass(score) {
  if (score >= 8) return 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
  if (score >= 5) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
  return 'text-rose-300 bg-rose-500/15 border-rose-500/30';
}

function getDifficultyLevel(score) {
  if (score >= 8) return 'Easy';
  if (score >= 5) return 'Medium';
  return 'Hard';
}

function getActivitySummary(updatedAt) {
  if (!updatedAt) {
    return 'Recent activity is unknown.';
  }

  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const diffDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return `Updated ${diffDays === 0 ? 'today' : `${diffDays} days ago`}. High activity.`;
  }

  if (diffDays <= 30) {
    return `Updated ${diffDays} days ago. Moderate activity.`;
  }

  return `Updated ${diffDays} days ago. Low activity.`;
}

export default function IssueDetails() {
  const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const issue = state?.issue;
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [checkedChecklistItems, setCheckedChecklistItems] = useState([]);
  const [startingContribution, setStartingContribution] = useState(false);
  const [isAlreadyTracked, setIsAlreadyTracked] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    if (!token || !issue?.html_url) return;
    fetch(API_ENDPOINTS.PROGRESS.BASE, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.progress) {
          const found = data.progress.some(p => p.issueUrl === issue.html_url);
          setIsAlreadyTracked(found);
        }
      })
      .catch(err => console.warn('Could not check tracking status:', err));
  }, [token, issue?.html_url]);

  const firstPrChecklist = [
    'Read README',
    'Understand the issue',
    'Created a new branch',
    'Tested changes',
    'Small and clear PR',
  ];

  const toggleStep = (id) => {
    if (checkedSteps.includes(id)) {
      setCheckedSteps(checkedSteps.filter(stepId => stepId !== id));
    } else {
      setCheckedSteps([...checkedSteps, id]);
    }
  };

  const toggleChecklistItem = (item) => {
    if (checkedChecklistItems.includes(item)) {
      setCheckedChecklistItems(
        checkedChecklistItems.filter((checkItem) => checkItem !== item)
      );
    } else {
      setCheckedChecklistItems([...checkedChecklistItems, item]);
    }
  };

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-foreground mb-3">Issue not found</h1>
        <p className="text-muted-foreground mb-6">
          Please go back to Explore and choose an issue again.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const recommendation = getRecommendation(issue.beginnerScore);
  const repoUrl = `https://github.com/${issue.repoName}`;
  const hasGoodFirstIssueLabel = (issue.labels || [])
    .some((label) => label.toLowerCase() === 'good first issue');
  const difficultyLevel = getDifficultyLevel(issue.beginnerScore);
  const repoActivitySummary = getActivitySummary(issue.updatedAt);

  const handleStartContribution = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setStartingContribution(true);
      const response = await fetch(
        API_ENDPOINTS.PROGRESS.BASE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            issueTitle: issue.issueTitle,
            repository: issue.repoName,
            issueUrl: issue.html_url,
            status: "Started"
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsAlreadyTracked(true);
        setFeedbackToast({
          type: 'success',
          message: data.message || 'Contribution added to your dashboard!'
        });
      } else {
        setFeedbackToast({
          type: 'error',
          message: data.message || 'Failed to start contribution.'
        });
      }
    } catch (err) {
      console.error(err);
      setFeedbackToast({
        type: 'error',
        message: 'Cannot connect to server. Please try again later.'
      });
    } finally {
      setStartingContribution(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-4">Issue Details</h1>
        <div className="space-y-3 text-slate-200">
          <p>
            <span className="font-semibold text-slate-100">Title:</span> {issue.issueTitle}
          </p>
          <p>
            <span className="font-semibold text-slate-100">Repository:</span> {issue.repoName}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100">Beginner Score:</span>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getScoreBadgeClass(issue.beginnerScore)}`}
            >
              {issue.beginnerScore}/10
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Should You Pick This Issue?</h2>
        <div className={`rounded-xl border px-4 py-4 ${recommendation.color}`}>
          <p className="font-bold mb-1">{recommendation.heading}</p>
          <p>{recommendation.text}</p>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Why this issue is good for you
        </h2>
        <p className="text-slate-400 mb-6">
          A quick beginner-friendly explanation before you start coding.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(124,137,255,0.8)]"></div>
              <div>
                <span className="font-bold text-slate-100 text-base block mb-0.5">Beginner-friendly issue</span>
                <span className="text-sm text-slate-400 leading-relaxed">With a beginner score of {issue.beginnerScore}/10, this issue has a manageable {difficultyLevel.toLowerCase()} difficulty.</span>
              </div>
            </li>
            
            <li className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(124,137,255,0.8)]"></div>
              <div>
                <span className="font-bold text-slate-100 text-base block mb-0.5">Small change required</span>
                <span className="text-sm text-slate-400 leading-relaxed">Perfect for getting familiar with the codebase and mastering the PR workflow without getting overwhelmed.</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(124,137,255,0.8)]"></div>
              <div>
                <span className="font-bold text-slate-100 text-base block mb-0.5">Active repository</span>
                <span className="text-sm text-slate-400 leading-relaxed">{repoActivitySummary} This means maintainers are likely around to review your PR.</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_rgba(124,137,255,0.8)]"></div>
              <div>
                <span className="font-bold text-slate-100 text-base block mb-0.5">Has 'good-first-issue' label</span>
                <span className="text-sm text-slate-400 leading-relaxed">
                  {hasGoodFirstIssueLabel
                    ? 'Yes, this issue is officially flagged by maintainers as an excellent starting point for newcomers.'
                    : 'While not explicitly labeled "good first issue", its metadata suggests it is appropriate for beginners to tackle.'}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          How a developer would approach this issue
        </h2>
        
        <ol className="list-decimal list-inside space-y-3 text-slate-300 font-medium">
          <li>Read the issue carefully</li>
          <li>Find relevant files in the repo</li>
          <li>Start with a small fix</li>
          <li>Test changes locally</li>
          <li>Create a clean pull request</li>
        </ol>
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Rocket className="w-5 h-5" />
          </div>
          Your Journey to PR
        </h2>
        
        {/* Progress Bar Container */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Contribution Progress</span>
            <span className="text-sm font-bold text-primary">{Math.round((checkedSteps.length / 6) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="h-full bg-linear-to-r from-primary to-accent transition-all duration-700 ease-out relative"
              style={{ width: `${(checkedSteps.length / 6) * 100}%` }}
            >
              {/* Optional animated glow on progress bar */}
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-sm -mr-5 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {[
            { id: 1, title: 'Fork the repository', desc: 'Click "Fork" on GitHub to create your own copy.' },
            { id: 2, title: 'Clone it locally', desc: `git clone https://github.com/YOUR-USERNAME/${issue.repoName.split('/')[1]}.git` },
            { id: 3, title: 'Create a new branch', desc: 'git checkout -b fix/my-awesome-feature' },
            { id: 4, title: 'Write code & Test', desc: 'Make your changes logically and ensure everything works.' },
            { id: 5, title: 'Commit and Push', desc: 'git add . && git commit -m "fix: explicit message" && git push' },
            { id: 6, title: 'Create a Pull Request', desc: 'Go to GitHub and click "Compare & pull request"' }
          ].map((step) => {
            const isChecked = checkedSteps.includes(step.id);
            return (
              <div 
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  isChecked 
                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_-3px_rgba(46,125,50,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isChecked ? 'bg-primary border-primary text-white' : 'border-slate-500 text-transparent'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
                <div>
                  <h3 className={`font-semibold transition-colors ${isChecked ? 'text-primary line-through opacity-80' : 'text-slate-200'}`}>
                    {step.id}. {step.title}
                  </h3>
                  <p className="text-sm font-mono text-slate-400 mt-1 bg-black/20 p-1.5 rounded-lg border border-white/5 inline-block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gamified Success Message */}
        {checkedSteps.length === 6 && (
          <div className="mt-8 p-4 rounded-xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center animate-pulse">
            <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> 
              You are ready to submit!
            </h3>
            <p className="text-sm text-emerald-300/80">Go claim your new Open Source PR.</p>
          </div>
        )}
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">First PR Checklist</h2>
        <p className="text-slate-400 mb-5">
          Use this quick checklist before you open your pull request.
        </p>

        <div className="space-y-3">
          {firstPrChecklist.map((item) => {
            const isChecked = checkedChecklistItems.includes(item);

            return (
              <label
                key={item}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                  isChecked
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleChecklistItem(item)}
                  className="h-4 w-4 rounded border-slate-500 bg-transparent text-primary focus:ring-primary/60"
                />
                <span
                  className={`text-sm md:text-base ${
                    isChecked ? 'text-primary' : 'text-slate-200'
                  }`}
                >
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block mb-0.5">Read README</span> 
              <span className="text-sm text-slate-400">understand setup, structure, and coding style.</span>
            </div>
          </li>
          <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block mb-0.5">Check existing PRs</span>
              <span className="text-sm text-slate-400">avoid duplicating work and learn from accepted changes.</span>
            </div>
          </li>
        </ul>
      </section>

      {feedbackToast && (
        <div className={`mb-6 p-4 rounded-xl border text-sm font-data-mono flex items-center justify-between gap-3 ${
          feedbackToast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedbackToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedbackToast.message}</span>
          </div>
          {feedbackToast.type === 'success' && (
            <Link
              to="/profile"
              className="text-xs uppercase underline tracking-wider font-bold text-emerald-300 hover:text-emerald-200"
            >
              Open Dashboard &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {isAlreadyTracked ? (
          <>
            <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-data-mono text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Currently Tracking
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-orange-500 text-black hover:bg-orange-400 transition cursor-pointer"
            >
              View in Dashboard
            </Link>
          </>
        ) : !isAuthenticated ? (
          <button
            onClick={() => navigate('/login', { state: { from: location } })}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-orange-500 text-black hover:bg-orange-400 transition cursor-pointer"
          >
            Please Log In to Track
          </button>
        ) : (
          <button
            onClick={handleStartContribution}
            disabled={startingContribution}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-orange-500 text-black hover:bg-orange-400 transition disabled:opacity-50 cursor-pointer"
          >
            {startingContribution ? "Saving..." : "Start Contribution"}
          </button>
        )}
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
        >
          Open Issue on GitHub
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
        >
          View Repository
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

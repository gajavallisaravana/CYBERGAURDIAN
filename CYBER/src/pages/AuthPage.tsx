import React, { useState } from 'react';
import { Shield, Lock, Mail, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (showForgot) {
        const res = await api.forgotPassword(email);
        setSuccessMsg(res.message);
        setLoading(false);
        return;
      }

      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        await register({ name, email, password, confirmPassword, collegeName });
      } else {
        await login({ email, password });
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await login({ email: demoEmail, password: 'GuardianPass123!' });
    } catch (err: any) {
      setError(err.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-12">
      {/* Background radial gradient */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-md shadow-blue-500/10 mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-white">CYBER GUARDIAN</h2>
          <p className="text-xs text-slate-400 mt-0.5">Learn. Detect. Defend.</p>
        </div>

        {/* Tab Switcher */}
        {!showForgot && (
          <div className="mt-6 flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                !isRegister ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                isRegister ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div className="mt-4 flex items-center space-x-2 rounded-xl bg-red-950/40 border border-red-800/60 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 flex items-center space-x-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 p-3 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {isRegister && !showForgot && (
            <>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Vance"
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
                  University / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  placeholder="e.g. Cyber Institute of Tech"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.edu"
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {!showForgot && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setError(null);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {isRegister && !showForgot && (
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition active:scale-98 mt-2"
          >
            {loading ? (
              'Processing...'
            ) : showForgot ? (
              'Send Reset Link'
            ) : isRegister ? (
              'Create Guardian Account'
            ) : (
              'Login to Defense Terminal'
            )}
          </button>

          {showForgot && (
            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
            >
              Back to Login
            </button>
          )}
        </form>

        {/* Quick Demo Logins for Judges */}
        {!showForgot && (
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <span className="block text-center text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Instant Hackathon Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('guardian@cyberdefense.org')}
                className="flex items-center justify-center space-x-1 rounded-lg bg-slate-900 border border-slate-800 py-2 px-2 text-slate-300 hover:border-blue-500/50 hover:bg-slate-850 transition"
              >
                <span>Alex (Level 2)</span>
                <ArrowRight className="h-3 w-3 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('maya@campus.edu')}
                className="flex items-center justify-center space-x-1 rounded-lg bg-slate-900 border border-slate-800 py-2 px-2 text-slate-300 hover:border-blue-500/50 hover:bg-slate-850 transition"
              >
                <span>Maya (Level 4)</span>
                <ArrowRight className="h-3 w-3 text-cyan-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

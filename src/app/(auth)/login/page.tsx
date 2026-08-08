'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log in');

      login(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@redsoftware.in');
    setPassword('Password123!');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail || email }),
      });
      setForgotSent(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="meta-card p-8 shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md mb-3">
            ∞
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log in to Accounts Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your connected accounts, profile, security & privacy
          </p>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Demo Credentials Available
            </span>
            <button
              onClick={handleDemoLogin}
              type="button"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md transition shadow"
            >
              Fill Demo Login
            </button>
          </div>
          <p className="text-[11px] opacity-90">
            Email: <code className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">demo@redsoftware.in</code> • Password: <code className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">Password123!</code>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white text-sm transition shadow flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Register now
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="meta-card max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reset Password</h3>
            {forgotSent ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>If an account exists, a password reset link has been sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail || email}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

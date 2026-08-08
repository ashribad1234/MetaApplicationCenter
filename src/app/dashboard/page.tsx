'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import {
  User,
  Share2,
  ShieldCheck,
  Smartphone,
  History,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 meta-card bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-44 meta-card bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-44 meta-card bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const connectedCount = data?.connectedAccounts?.length || 0;
  const activeSessionsCount = data?.sessions?.length || 1;
  const is2FA = data?.user?.is2FAEnabled;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="meta-card p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-sm opacity-90">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs rounded-lg transition border border-white/30 flex items-center gap-1"
          >
            <span>Edit Profile</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connected Accounts Card */}
        <div className="meta-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Connected Accounts</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {connectedCount} social account{connectedCount !== 1 ? 's' : ''} connected
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/connected-accounts"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {data?.connectedAccounts?.length > 0 ? (
              data.connectedAccounts.map((acc: any) => (
                <span
                  key={acc.id}
                  className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {acc.provider} (@{acc.providerUsername})
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No accounts connected yet.</span>
            )}
          </div>
        </div>

        {/* Security Status Card */}
        <div className="meta-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Security Status</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {is2FA ? 'Two-Factor Authentication Active' : '2FA Recommended'}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/security"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Security Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span className="text-gray-600 dark:text-gray-400">2-Factor Authentication</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded ${
                is2FA
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
              }`}
            >
              {is2FA ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Connected Devices Card */}
        <div className="meta-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Device Sessions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeSessionsCount} active login session{activeSessionsCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/devices"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Devices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
            Current Device:{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {data?.sessions?.[0]?.deviceName || 'Active Session'}
            </span>
          </div>
        </div>

        {/* OpenAPI Documentation Card */}
        <div className="meta-card p-5 space-y-4 bg-gradient-to-tr from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Swagger API Docs</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interactive REST API documentation
                </p>
              </div>
            </div>
            <Link
              href="/api-docs"
              target="_blank"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow flex items-center gap-1"
            >
              <span>View Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/60 dark:border-gray-800">
            Explore OpenAPI 3.0 endpoints for Auth, Profile, Security, Privacy, and Devices.
          </p>
        </div>
      </div>
    </div>
  );
}

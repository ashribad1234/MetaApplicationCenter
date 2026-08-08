'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, Smartphone, RefreshCw, Filter, Calendar } from 'lucide-react';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const url = filterType !== 'ALL' ? `/api/activity?actionType=${filterType}` : '/api/activity';
      const res = await fetch(url);
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filterType]);

  const actionBadges: any = {
    LOGIN: { label: 'Login', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    LOGOUT: { label: 'Logout', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    PASSWORD_CHANGE: { label: 'Password Changed', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' },
    PROFILE_UPDATE: { label: 'Profile Updated', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
    ACCOUNT_CONNECTED: { label: 'Account Connected', color: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300' },
    ACCOUNT_DISCONNECTED: { label: 'Account Disconnected', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' },
    PRIVACY_UPDATE: { label: 'Privacy Updated', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
    SESSION_REVOKED: { label: 'Session Revoked', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300' },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review security events, logins, connected account changes, and setting updates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="LOGIN">Logins</option>
              <option value="PASSWORD_CHANGE">Password Changes</option>
              <option value="PROFILE_UPDATE">Profile Updates</option>
              <option value="ACCOUNT_CONNECTED">Account Connects</option>
              <option value="PRIVACY_UPDATE">Privacy Updates</option>
            </select>
          </div>

          <button
            onClick={fetchActivities}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 meta-card animate-pulse"></div>
          <div className="h-16 meta-card animate-pulse"></div>
          <div className="h-16 meta-card animate-pulse"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="meta-card p-8 text-center space-y-2">
          <History className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">No activity recorded</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No events match your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const badge = actionBadges[act.actionType] || {
              label: act.actionType,
              color: 'bg-gray-100 text-gray-700',
            };
            const dateStr = new Date(act.createdAt).toLocaleString();

            return (
              <div
                key={act.id}
                className="meta-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {act.description}
                    </span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 flex items-center space-x-3 text-[11px]">
                    <span>Device: {act.deviceName}</span>
                    <span>•</span>
                    <span>Browser: {act.browser}</span>
                    <span>•</span>
                    <span>IP: {act.ipAddress}</span>
                  </div>
                </div>

                <div className="text-gray-400 dark:text-gray-500 text-[11px] whitespace-nowrap self-end sm:self-center flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{dateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

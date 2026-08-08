'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Eye, Mail, Phone, Target, Share2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PrivacySettingsPage() {
  const [profileVisibility, setProfileVisibility] = useState('EVERYONE');
  const [emailVisibility, setEmailVisibility] = useState('ONLY_ME');
  const [phoneVisibility, setPhoneVisibility] = useState('ONLY_ME');
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/privacy')
      .then((res) => res.json())
      .then((data) => {
        if (data.privacy) {
          setProfileVisibility(data.privacy.profileVisibility);
          setEmailVisibility(data.privacy.emailVisibility);
          setPhoneVisibility(data.privacy.phoneVisibility);
          setPersonalizedAds(data.privacy.personalizedAds);
          setDataSharing(data.privacy.dataSharing);
        }
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileVisibility,
          emailVisibility,
          phoneVisibility,
          personalizedAds,
          dataSharing,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update privacy settings');

      setSuccess('Privacy settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-64 meta-card animate-pulse"></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Control who can see your information and how Meta uses your data.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-lg text-xs flex items-center gap-2 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Visibility Controls */}
        <div className="meta-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            Visibility & Searchability
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200">Profile Visibility</label>
                <p className="text-gray-500 dark:text-gray-400">Who can search and see your Meta profile</p>
              </div>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-medium"
              >
                <option value="EVERYONE">Everyone (Public)</option>
                <option value="FRIENDS">Friends & Followers Only</option>
                <option value="ONLY_ME">Only Me (Private)</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200">Email Address Visibility</label>
                <p className="text-gray-500 dark:text-gray-400">Who can see your email address</p>
              </div>
              <select
                value={emailVisibility}
                onChange={(e) => setEmailVisibility(e.target.value)}
                className="px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-medium"
              >
                <option value="EVERYONE">Everyone</option>
                <option value="FRIENDS">Friends</option>
                <option value="ONLY_ME">Only Me</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200">Phone Number Visibility</label>
                <p className="text-gray-500 dark:text-gray-400">Who can look you up by phone number</p>
              </div>
              <select
                value={phoneVisibility}
                onChange={(e) => setPhoneVisibility(e.target.value)}
                className="px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-medium"
              >
                <option value="EVERYONE">Everyone</option>
                <option value="FRIENDS">Friends</option>
                <option value="ONLY_ME">Only Me</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ad Preferences & Data Sharing */}
        <div className="meta-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
            Ad Preferences & Analytics
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200">Personalized Advertisements</label>
                <p className="text-gray-500 dark:text-gray-400">Allow Meta to tailor ads based on activity</p>
              </div>
              <input
                type="checkbox"
                checked={personalizedAds}
                onChange={(e) => setPersonalizedAds(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200">Third-Party Data Sharing</label>
                <p className="text-gray-500 dark:text-gray-400">Share account data with external partner apps</p>
              </div>
              <input
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

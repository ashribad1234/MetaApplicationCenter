'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { ShieldCheck, Lock, Smartphone, CheckCircle2, AlertCircle, KeyRound, SmartphoneNfc } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function SecurityCenterPage() {
  const { user, refreshUser } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [toggling2FA, setToggling2FA] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/security/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      setSuccess('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setToggling2FA(true);
    setError('');
    setSuccess('');

    try {
      const targetState = !user?.is2FAEnabled;
      const res = await fetch('/api/security/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: targetState }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update 2FA');

      setSuccess(data.message);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Center</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage password security, two-factor authentication, and login safety.
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

      {/* Password Management */}
      <div className="meta-card p-6 flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Account Password</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Change your password periodically to keep your Meta accounts secure.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setError('');
            setIsPasswordModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow flex-shrink-0"
        >
          Change Password
        </button>
      </div>

      {/* 2FA Toggle Card */}
      <div className="meta-card p-6 flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <SmartphoneNfc className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  user?.is2FAEnabled
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300'
                }`}
              >
                {user?.is2FAEnabled ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Require a secondary verification code whenever logging in from unknown devices.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle2FA}
          disabled={toggling2FA}
          className={`px-4 py-2 font-semibold text-xs rounded-lg transition shadow flex-shrink-0 ${
            user?.is2FAEnabled
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {toggling2FA ? 'Updating...' : user?.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              New Password (min. 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

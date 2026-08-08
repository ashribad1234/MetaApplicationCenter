'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP'>('INSTAGRAM');
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/connected-accounts');
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/connected-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          providerUsername: username,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect account');

      setSuccess(`Successfully connected ${selectedProvider} account!`);
      setIsModalOpen(false);
      setUsername('');
      fetchAccounts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDisconnect = async (id: string, provider: string) => {
    if (!confirm(`Are you sure you want to disconnect your ${provider} account?`)) return;

    try {
      const res = await fetch(`/api/connected-accounts?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccess(`Disconnected ${provider} account.`);
        fetchAccounts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const providersConfig = {
    INSTAGRAM: { name: 'Instagram', color: 'from-pink-500 to-purple-600', icon: '📸' },
    FACEBOOK: { name: 'Facebook', color: 'from-blue-600 to-blue-700', icon: '📘' },
    WHATSAPP: { name: 'WhatsApp', color: 'from-green-500 to-emerald-600', icon: '💬' },
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage connected social accounts to share experiences across Meta platforms.
          </p>
        </div>
        <button
          onClick={() => {
            setError('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-lg text-xs flex items-center gap-2 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 meta-card animate-pulse"></div>
          <div className="h-20 meta-card animate-pulse"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="meta-card p-8 text-center space-y-3">
          <Share2 className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">No Connected Accounts</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Connect your Facebook, Instagram, or WhatsApp accounts to get cross-posting and unified login benefits.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const config = (providersConfig as any)[acc.provider] || {
              name: acc.provider,
              color: 'from-gray-600 to-gray-700',
              icon: '🔗',
            };
            return (
              <div
                key={acc.id}
                className="meta-card p-4 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${config.color} flex items-center justify-center text-xl text-white shadow-md`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {config.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300">
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{acc.providerUsername}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDisconnect(acc.id, config.name)}
                  className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-xs font-semibold flex items-center space-x-1"
                  title="Remove account"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Connect Social Account (Mock OAuth)"
      >
        <form onSubmit={handleConnect} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Social Platform
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'] as const).map((prov) => {
                const isSel = selectedProvider === prov;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setSelectedProvider(prov)}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition ${
                      isSel
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">
                      {prov === 'INSTAGRAM' ? '📸' : prov === 'FACEBOOK' ? '📘' : '💬'}
                    </span>
                    <span>{prov}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Account Handle / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex_official"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-[11px] text-gray-500 dark:text-gray-400">
            ℹ️ No real OAuth API keys required for this assessment. Clicking connect creates a verified mock connection.
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              Confirm Connection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

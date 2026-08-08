'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Globe, LogOut, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function ConnectedDevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/devices');
      const data = await res.json();
      setDevices(data.devices || []);
      setCurrentSessionId(data.currentSessionId || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (id: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to log out session on "${deviceName}"?`)) return;

    try {
      const res = await fetch(`/api/devices?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Logged out session on ${deviceName}`);
        fetchDevices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeAllOther = async () => {
    if (!confirm('Log out of all other active device sessions across browsers and devices?')) return;

    try {
      const res = await fetch('/api/devices?revokeAll=true', { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Successfully logged out of all other active device sessions');
        fetchDevices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Devices & Sessions</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            See where you are currently logged in across web browsers and mobile devices.
          </p>
        </div>

        {devices.length > 1 && (
          <button
            onClick={handleRevokeAllOther}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition shadow flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout All Other Devices</span>
          </button>
        )}
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
      ) : (
        <div className="space-y-3">
          {devices.map((device) => {
            const isCurrent = device.isCurrentSession;
            const isMobile = device.deviceType === 'Mobile';

            return (
              <div
                key={device.id}
                className={`meta-card p-4 flex items-center justify-between transition ${
                  isCurrent ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                      isMobile
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}
                  >
                    {isMobile ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {device.deviceName}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2 mt-0.5">
                      <span>{device.browser}</span>
                      <span>•</span>
                      <span>{device.os}</span>
                      <span>•</span>
                      <span>IP: {device.ipAddress}</span>
                    </div>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleRevoke(device.id, device.deviceName)}
                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-xs font-semibold flex items-center space-x-1"
                    title="Log out device"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Revoke</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

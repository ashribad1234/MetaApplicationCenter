'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            ∞
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Meta Accounts Center
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
                <span className="hidden sm:inline font-medium text-sm text-gray-800 dark:text-gray-200">
                  {user.name}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

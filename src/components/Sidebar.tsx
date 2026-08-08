'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Share2,
  ShieldCheck,
  Lock,
  History,
  Smartphone,
  BookOpen,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile Details', icon: User },
  { href: '/dashboard/connected-accounts', label: 'Connected Accounts', icon: Share2 },
  { href: '/dashboard/security', label: 'Security Center', icon: ShieldCheck },
  { href: '/dashboard/privacy', label: 'Privacy Settings', icon: Lock },
  { href: '/dashboard/activity', label: 'Activity Log', icon: History },
  { href: '/dashboard/devices', label: 'Connected Devices', icon: Smartphone },
  { href: '/api-docs', label: 'API Specs (Swagger)', icon: BookOpen, external: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 meta-card p-4 space-y-2 self-start flex-shrink-0">
      <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow">
          ∞
        </div>
        <div>
          <h2 className="font-bold text-sm leading-tight text-gray-900 dark:text-white">
            Meta Accounts Center
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Account Management</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : '_self'}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

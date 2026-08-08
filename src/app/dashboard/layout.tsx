'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading Meta Accounts Center...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Sidebar />
      <section className="flex-1 w-full">{children}</section>
    </div>
  );
}

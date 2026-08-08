import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeContext';
import { AuthProvider } from '@/components/AuthContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Meta Accounts Center - Red Software Assignment',
  description: 'Manage your connected accounts, profile, security, and privacy settings in one centralized place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#0F1419] text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
              Meta Accounts Center Clone • Red Software Developer Assignment • 2026
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SmartNotes
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Notes
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/upload"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Upload Notes
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user?.points} pts
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
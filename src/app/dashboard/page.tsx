'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/lib/auth-context';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface Note {
  _id: string;
  topicTitle: string;
  country: string;
  university: string;
  views: number;
  downloads: number;
  createdAt: string;
}

interface DashboardData {
  user: User;
  notes: Note[];
  stats: {
    totalNotes: number;
    totalViews: number;
    totalDownloads: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.user.name}!</h1>
              <p className="text-gray-600">{data.user.email}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{data.user.points}</div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.stats.totalNotes}</div>
                <div className="text-sm text-gray-500">Notes Uploaded</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👁</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.stats.totalViews}</div>
                <div className="text-sm text-gray-500">Total Views</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⬇</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.stats.totalDownloads}</div>
                <div className="text-sm text-gray-500">Total Downloads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Notes</h2>
          </div>
          
          {data.notes.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't uploaded any notes yet.</p>
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload Your First Note
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {data.notes.map((note) => (
                <div key={note._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{note.topicTitle}</h3>
                      <p className="text-sm text-gray-600">
                        {note.university} • {note.country}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded on {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👁 {note.views} views</span>
                      <span>⬇ {note.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
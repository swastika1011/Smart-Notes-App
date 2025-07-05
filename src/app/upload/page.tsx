'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NoteUploadForm from '@/components/NoteUploadForm';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/lib/auth-context';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleUpload = async (formData: FormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/notes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setSuccess('Note uploaded successfully! You earned 10 points.');
      
      // Reset form after successful upload
      setTimeout(() => {
        setSuccess('');
        // You could redirect to dashboard or clear form
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Notes</h1>
          <p className="mt-2 text-gray-600">
            Share your academic notes and earn points when others view or download them.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <NoteUploadForm onSubmit={handleUpload} loading={loading} />
      </div>
    </div>
  );
} 
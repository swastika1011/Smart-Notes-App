'use client';

import { useState, useEffect } from 'react';
import SearchFilters from '@/components/SearchFilters';
import NoteCard from '@/components/NoteCard';
import Navigation from '@/components/Navigation';

interface Note {
  _id: string;
  topicTitle: string;
  country: string;
  university: string;
  subjectTag?: string;
  description?: string;
  views: number;
  downloads: number;
  uploaderId: {
    name: string;
  };
  createdAt: string;
}

export default function BrowsePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = async (filters: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.country) params.append('country', filters.country);
      if (filters.university) params.append('university', filters.university);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/notes?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch notes');
      }

      setNotes(result.notes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes({
      search: '',
      country: '',
      university: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  const handleView = async (noteId: string) => {
    try {
      await fetch(`/api/notes/${noteId}/view`, {
        method: 'POST',
      });
      
      // Update the note's view count locally
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId ? { ...note, views: note.views + 1 } : note
        )
      );
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handleDownload = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}/download`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update the note's download count locally
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === noteId ? { ...note, downloads: note.downloads + 1 } : note
          )
        );
        
        // Simulate file download (in real app, this would download the actual file)
        alert('Download started! The file would be downloaded in a real application.');
      }
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Notes</h1>
          <p className="mt-2 text-gray-600">
            Discover academic notes from students around the world.
          </p>
        </div>

        <SearchFilters onSearch={fetchNotes} />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No notes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
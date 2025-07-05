'use client';

import { useState } from 'react';

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Japan', 'India', 'Brazil', 'Mexico', 'South Africa',
  'Singapore', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Switzerland', 'Austria', 'Belgium', 'Italy', 'Spain', 'Portugal',
  'Ireland', 'New Zealand', 'South Korea', 'China', 'Russia', 'Turkey',
  'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay',
  'Paraguay', 'Bolivia', 'Ecuador', 'Guyana', 'Suriname', 'French Guiana'
];

interface NoteUploadFormProps {
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
}

export default function NoteUploadForm({ onSubmit, loading = false }: NoteUploadFormProps) {
  const [formData, setFormData] = useState({
    topicTitle: '',
    country: '',
    university: '',
    subjectTag: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('topicTitle', formData.topicTitle);
    data.append('country', formData.country);
    data.append('university', formData.university);
    data.append('subjectTag', formData.subjectTag);
    data.append('description', formData.description);

    onSubmit(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid PDF file');
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Academic Notes</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            PDF File *
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">Only PDF files are allowed</p>
        </div>

        <div>
          <label htmlFor="topicTitle" className="block text-sm font-medium text-gray-700">
            Topic Title *
          </label>
          <input
            type="text"
            id="topicTitle"
            value={formData.topicTitle}
            onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Introduction to Machine Learning"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="university" className="block text-sm font-medium text-gray-700">
            University *
          </label>
          <input
            type="text"
            id="university"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Stanford University"
            required
          />
        </div>

        <div>
          <label htmlFor="subjectTag" className="block text-sm font-medium text-gray-700">
            Subject Tag
          </label>
          <input
            type="text"
            id="subjectTag"
            value={formData.subjectTag}
            onChange={(e) => setFormData({ ...formData, subjectTag: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Computer Science, Mathematics"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the notes content..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Notes'}
        </button>
      </form>
    </div>
  );
} 
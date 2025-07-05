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

interface SearchFiltersProps {
  onSearch: (filters: {
    search: string;
    country: string;
    university: string;
    sortBy: string;
    sortOrder: string;
  }) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    university: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      country: '',
      university: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Topics
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by topic title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
            University
          </label>
          <input
            type="text"
            id="university"
            value={filters.university}
            onChange={(e) => handleFilterChange('university', e.target.value)}
            placeholder="Filter by university..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Date</option>
            <option value="popularity">Popularity</option>
            <option value="views">Views</option>
            <option value="downloads">Downloads</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="desc"
              checked={filters.sortOrder === 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Descending</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sortOrder"
              value="asc"
              checked={filters.sortOrder === 'asc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Ascending</span>
          </label>
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 
// frontend/app/colleges/page.tsx
'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronDown, Loader } from 'lucide-react';
import { useColleges } from '@/hooks/useColleges';
import { CollegeCard } from '@/components/colleges/CollegeCard';

const LOCATIONS = [
  'Delhi',
  'Mumbai',
  'Chennai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Coimbatore',
  'Trichy',
  'Kanpur',
  'Jalandhar'
];

const COURSES = [
  'B.Tech Computer Science',
  'B.Tech Electrical Engineering',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'B.Tech Chemical Engineering',
  'B.Tech Electronics Engineering',
  'B.Tech Aerospace Engineering',
  'B.Tech Production Engineering',
  'B.Tech Information Technology',
  'B.Tech Biomedical Engineering'
];

const FEE_RANGES = [
  { label: 'Under ₹5 Lakhs', min: 0, max: 500000 },
  { label: '₹5L - ₹10L', min: 500000, max: 1000000 },
  { label: '₹10L - ₹15L', min: 1000000, max: 1500000 },
  { label: 'Above ₹15L', min: 1500000, max: Infinity }
];

const RATINGS = [3.0, 3.5, 4.0, 4.5];

function CollegeListingContent() {
  const { colleges, pagination, isLoading, error, page, setPage, setFilters } = useColleges();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  const currentFilters = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      location: searchParams.get('location') ?? '',
      course: searchParams.get('course') ?? '',
      minFees: searchParams.get('minFees') ? parseInt(searchParams.get('minFees')!) : undefined,
      maxFees: searchParams.get('maxFees') ? parseInt(searchParams.get('maxFees')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      sortBy: searchParams.get('sortBy') ?? 'name',
      sortOrder: (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc'
    }),
    [searchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setFilters({ search: value || null });
    }, 400);
    setSearchTimeout(timeout);
  };

  const handleLocationChange = (value: string) => {
    setFilters({ location: value || null });
  };

  const handleCourseChange = (value: string) => {
    setFilters({ course: value || null });
  };

  const handleFeeRangeChange = (min: number, max: number) => {
    setFilters({
      minFees: max === Infinity ? null : min,
      maxFees: max === Infinity ? null : max
    });
  };

  const handleRatingChange = (value: number) => {
    setFilters({ minRating: value || null });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({ sortBy });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      search: null,
      location: null,
      course: null,
      minFees: null,
      maxFees: null,
      minRating: null,
      sortBy: null,
      sortOrder: null
    });
  };

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.location ||
    currentFilters.course ||
    currentFilters.minFees ||
    currentFilters.maxFees ||
    currentFilters.minRating;

  const queryString = searchParams.toString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your College</h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by college name or location..."
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle and Sort */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
            >
              <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              Filters {hasActiveFilters && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Active</span>}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg"
              >
                Clear All
              </button>
            )}

            <select
              value={currentFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="fees">Sort by Fees</option>
              <option value="placementRate">Sort by Placement</option>
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-gray-50 border-t px-4 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                <select
                  value={currentFilters.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Course</label>
                <select
                  value={currentFilters.course}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Courses</option>
                  {COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Fee Range</label>
                <select
                  value={
                    currentFilters.minFees && currentFilters.maxFees
                      ? `${currentFilters.minFees}-${currentFilters.maxFees}`
                      : ''
                  }
                  onChange={(e) => {
                    if (!e.target.value) {
                      setFilters({ minFees: null, maxFees: null });
                    } else {
                      const [min, max] = e.target.value.split('-').map(Number);
                      handleFeeRangeChange(min, max);
                    }
                  }}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Fees</option>
                  {FEE_RANGES.map((range) => (
                    <option key={range.label} value={`${range.min}-${range.max}`}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Min Rating</label>
                <select
                  value={currentFilters.minRating ?? ''}
                  onChange={(e) => handleRatingChange(e.target.value ? parseFloat(e.target.value) : 0)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  {RATINGS.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}+ ⭐
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
            <span className="ml-4 text-gray-600 text-lg">Loading colleges...</span>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No colleges found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 text-gray-600">
              Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold">{pagination.total}</span> colleges
            </div>

            {/* Colleges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} queryString={queryString} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 1 || p === 1 || p === pagination.totalPages)
                  .map((p, idx, arr) => (
                    <div key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-lg border ${
                          p === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}

                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CollegeListingContent />
    </Suspense>
  );
}

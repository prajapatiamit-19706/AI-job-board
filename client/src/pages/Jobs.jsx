import { useState, useEffect } from 'react';
import { useGetJobs } from '../hooks/useJobs';
import JobCard from '../components/common/JobCard';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [page, setPage] = useState(1);

  const types = ['All', 'full-time', 'part-time', 'remote', 'internship'];

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page on new search
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const filters = {
    search: debouncedSearchTerm || undefined,
    type: activeType !== 'All' ? activeType : undefined,
    page,
    limit: 10,
  };

  const { data, isLoading, isError } = useGetJobs(filters);

  const handleTypeChange = (type) => {
    setActiveType(type);
    setPage(1);
  };

  return (
    <div className="bg-bg-main min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-bg-card border-b border-border-soft py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl text-text-primary font-bold tracking-tight mb-4">
            Find Your Next Role
          </h1>
          <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
            Discover opportunities that match your skills and experience using our AI-powered job board.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-surface border border-border-soft rounded-xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors shadow-sm text-lg"
              placeholder="Search job title..."
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all capitalize ${
                  activeType === type
                    ? 'bg-purple text-white shadow-md'
                    : 'bg-bg-surface text-text-muted border border-border-soft hover:border-purple/50'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {/* Results Header */}
        <div className="mb-6">
          <p className="text-text-muted text-sm font-medium">
            {isLoading ? 'Loading jobs...' : `${data?.total || 0} jobs found`}
          </p>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl p-6 text-center">
            <p>Failed to load jobs. Please try again later.</p>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton Loader
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-bg-card border border-border-soft rounded-xl p-5 h-56 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-bg-surface animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-bg-surface rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-bg-surface rounded animate-pulse w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2 mb-auto">
                  <div className="h-6 w-16 bg-bg-surface rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-bg-surface rounded-full animate-pulse" />
                </div>
                <div className="border-t border-border-soft pt-4 flex justify-between items-center mt-4">
                  <div className="h-4 w-24 bg-bg-surface rounded animate-pulse" />
                  <div className="h-8 w-24 bg-bg-surface rounded-lg animate-pulse" />
                </div>
              </div>
            ))
          ) : data?.jobs?.length > 0 ? (
            data.jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            // Empty State
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mb-4 text-text-hint border border-border-soft">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-muted text-lg">No jobs found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveType('All'); }}
                className="mt-4 text-purple-light hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-purple/60 text-purple-light rounded-lg hover:bg-purple-muted transition-all px-4 py-2 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </button>
            <span className="text-text-muted text-sm">
              Page {page} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="border border-purple/60 text-purple-light rounded-lg hover:bg-purple-muted transition-all px-4 py-2 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

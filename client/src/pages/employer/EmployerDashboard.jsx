import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetEmployerJobs, useCloseJob } from '../../hooks/useJobs';
import PostJobModal from '../../components/employer/PostJobModal';

const EmployerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: jobs, isLoading, isError } = useGetEmployerJobs();
  const closeJobMutation = useCloseJob();

  const handleCloseJob = (id) => {
    if (window.confirm('Are you sure you want to close this job? Candidates will no longer be able to apply.')) {
      closeJobMutation.mutate(id);
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'open':
        return <span className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium">Open</span>;
      case 'closed':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs font-medium">Closed</span>;
      case 'draft':
      default:
        return <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs font-medium">Draft</span>;
    }
  };

  const totalJobs = jobs?.length || 0;
  const openJobs = jobs?.filter(j => j.status === 'open').length || 0;
  const totalApplicants = jobs?.reduce((sum, job) => sum + (job.applicantCount || 0), 0) || 0;

  return (
    <div className="bg-bg-main min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-text-primary font-bold text-3xl">My Job Postings</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple text-white font-bold rounded-lg px-6 py-2.5 hover:bg-purple/90 transition-all shadow-lg shadow-purple/20"
          >
            Post New Job
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Total Jobs Posted</h3>
            <p className="text-purple-light text-4xl font-bold">{isLoading ? '-' : totalJobs}</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Total Applicants</h3>
            <p className="text-purple-light text-4xl font-bold">{isLoading ? '-' : totalApplicants}</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Open Jobs</h3>
            <p className="text-purple-light text-4xl font-bold">{isLoading ? '-' : openJobs}</p>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-bg-card border border-border-soft rounded-xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-text-muted animate-pulse">Loading jobs...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-400">Failed to load jobs.</div>
          ) : jobs?.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-border-soft text-text-hint">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-muted text-lg mb-6">You haven't posted any jobs yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="border border-purple/60 text-purple-light rounded-lg hover:bg-purple-muted transition-all px-6 py-2.5 font-medium"
              >
                Post your first job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-primary">
                <thead className="bg-bg-surface text-text-muted text-xs uppercase font-medium border-b border-border-soft">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-center">Applicants</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Posted Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${job._id}`} className="font-bold hover:text-purple-light transition-colors">
                          {job.title}
                        </Link>
                        <div className="text-text-muted text-xs mt-1">{job.location || 'Remote'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-text-muted">{job.type.replace('-', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-bg-surface text-text-primary border border-border-soft rounded-full w-8 h-8 inline-flex items-center justify-center font-bold">
                          {job.applicantCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusPill(job.status)}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="border border-purple/60 text-purple-light rounded-lg hover:bg-purple-muted transition-all px-3 py-1.5 text-xs font-medium"
                          >
                            View Applicants
                          </Link>
                          {job.status === 'open' && (
                            <button 
                              onClick={() => handleCloseJob(job._id)}
                              disabled={closeJobMutation.isPending}
                              className="text-text-hint hover:text-red-400 font-medium text-xs transition-colors px-2"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EmployerDashboard;

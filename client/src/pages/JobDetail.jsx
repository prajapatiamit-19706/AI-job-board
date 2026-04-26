import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobById } from '../hooks/useJobs';
import useAuthStore from '../store/authStore';
import ApplyModal from '../components/candidate/ApplyModal'
import { useGetCandidateApplications } from '../hooks/useApplications';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: job, isLoading, isError } = useGetJobById(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: myApplications = [] } = useGetCandidateApplications({
    enabled: !!user && user.role === 'candidate',
  });

  const existingApplication = myApplications.find((app) => app.job?._id === id || app.job === id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8 w-full">
        <div className="mb-6 h-6 w-24 bg-bg-surface rounded animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="h-10 w-3/4 bg-bg-surface rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 w-32 bg-bg-surface rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-bg-surface rounded-full animate-pulse" />
            </div>
            <div className="h-px bg-border-soft w-full my-6" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-bg-surface rounded animate-pulse" />
              <div className="h-4 w-full bg-bg-surface rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-bg-surface rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-bg-card border border-border-soft rounded-xl p-6 h-48 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl text-text-primary font-bold mb-4">Job not found</h2>
        <button onClick={() => navigate('/jobs')} className="text-purple-light hover:underline">
          Return to jobs
        </button>
      </div>
    );
  }

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `${currency} ${min.toLocaleString()}+`;
    if (!min && max) return `Up to ${currency} ${max.toLocaleString()}`;
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const isEmployerOrAdmin = user?.role === 'employer' || user?.role === 'admin';

  return (
    <div className="bg-bg-main min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-text-muted hover:text-text-primary mb-6 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span>←</span> Back to jobs
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3">
            <div className="flex items-start gap-4 mb-4">
              {job.employer?.companyLogo && (
                <img
                  src={job.employer.companyLogo}
                  alt={job.employer.companyName}
                  className="w-16 h-16 rounded-xl object-cover border border-border-soft hidden sm:block"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-text-primary leading-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-sm font-medium">
                    {job.employer?.companyName || job.employer?.name}
                  </span>
                  <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-sm font-medium">
                    {job.location || 'Remote'}
                  </span>
                  <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-sm font-medium capitalize">
                    {job.type.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border-soft my-8"></div>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">About this role</h2>
              <div className="text-text-muted leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">Requirements</h2>
                <ul className="list-disc list-outside pl-5 space-y-2 text-text-muted">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills && job.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-text-primary mb-4">Skills required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-purple-muted text-purple-light border border-border-purple rounded-full px-4 py-2 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (Sticky) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-bg-card border border-border-soft rounded-xl p-6">
                <div className="mb-6">
                  <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Salary</h3>
                  <div className="text-purple-light text-2xl font-bold">
                    {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Posted</h3>
                  <div className="text-text-primary">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>

                {!user ? (
                  <button
                    onClick={() => navigate('/login', { state: { from: `/jobs/${job._id}` } })}
                    className="w-full bg-purple text-white font-bold rounded-lg py-3 hover:bg-purple/90 transition-all text-center"
                  >
                    Log in to Apply
                  </button>
                ) : isEmployerOrAdmin ? (
                  <div className="bg-bg-surface border border-border-soft rounded-lg p-4 text-center">
                    <p className="text-text-hint text-sm font-medium">
                      You cannot apply to jobs with an {user.role} account.
                    </p>
                  </div>
                ) : existingApplication ? (
                  <div className={`text-center font-bold px-4 py-3 rounded-lg border uppercase tracking-wider
                    ${existingApplication.status === 'applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${existingApplication.status === 'shortlisted' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                    ${existingApplication.status === 'interview' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                    ${existingApplication.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    ${existingApplication.status === 'hired' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                  `}>
                    Status: {existingApplication.status}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full bg-purple text-white font-bold rounded-lg py-3 hover:bg-purple/90 transition-all text-center shadow-lg shadow-purple/20"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {job && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={job._id}
          jobTitle={job.title}
          companyName={job.employer?.companyName || job.employer?.name}
        />
      )}
    </div>
  );
};

export default JobDetail;

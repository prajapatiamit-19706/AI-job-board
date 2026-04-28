import { Link } from 'react-router-dom';
import { useGetCandidateApplications, useWithdrawApplication } from '../../hooks/useApplications';
import AIScoreSummary from '../../components/candidate/AIScoreSummary';
import InterviewPrepCard from '../../components/candidate/InterviewPrepCard';

const CandidateDashboard = () => {
  const { data: applications = [], isLoading } = useGetCandidateApplications();
  const { mutate: withdrawApplication } = useWithdrawApplication();

  if (isLoading) {
    return (
      <div className="bg-bg-main min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-text-primary font-bold text-3xl mb-8">My Applications</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-bg-surface border border-border-soft rounded-xl p-6 h-28 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalApplied = applications.length;
  const shortlisted = applications.filter((app) => app.status === 'shortlisted').length;
  const interviews = applications.filter((app) => app.status === 'interview').length;

  const handleWithdraw = (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      withdrawApplication(id);
    }
  };

  const getStatusClasses = (status) => {
    const map = {
      applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      interview: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      hired: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return map[status] || 'bg-bg-surface text-text-muted border-border-soft';
  };

  return (
    <div className="bg-bg-main min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-text-primary font-bold text-3xl mb-8">My Applications</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Total Applied</h3>
            <p className="text-purple-light text-4xl font-bold">{totalApplied}</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Shortlisted</h3>
            <p className="text-purple-light text-4xl font-bold">{shortlisted}</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Interviews</h3>
            <p className="text-purple-light text-4xl font-bold">{interviews}</p>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-bg-card border border-border-soft rounded-xl p-5 flex flex-col">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    {app.job?.employer?.companyLogo ? (
                      <img src={app.job.employer.companyLogo} alt="Logo" className="w-14 h-14 rounded-full object-cover border border-border-soft" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-bg-surface flex items-center justify-center text-purple-light font-bold border border-border-soft text-xl">
                        {(app.job?.employer?.companyName || 'C').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-text-primary font-bold text-lg">{app.job?.title || 'Unknown Job'}</h3>
                    <p className="text-text-muted text-sm">{app.job?.employer?.companyName || 'Unknown Company'}</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs">
                      {app.job?.location || 'Remote'}
                    </span>
                    <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs capitalize">
                      {app.job?.type?.replace('-', ' ') || 'Full time'}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <span className={`px-3 py-1 text-xs uppercase border rounded-full font-bold ${getStatusClasses(app.status)}`}>
                      {app.status}
                    </span>
                    <div className="text-text-hint text-xs">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-4 border-l border-border-soft">
                    <Link to={`/jobs/${app.job?._id}`} className="text-purple-light text-sm hover:underline">
                      View Job
                    </Link>
                    {app.status === 'applied' && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        className="text-text-hint text-sm hover:text-red-400 transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                <AIScoreSummary application={app} />
                {(app.status === 'shortlisted' || app.status === 'interview') && (
                  <InterviewPrepCard applicationId={app._id} jobTitle={app.job?.title} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bg-card border border-border-purple rounded-xl p-10 text-center max-w-2xl mx-auto shadow-lg shadow-purple/5 mt-8">
            <h2 className="text-2xl text-text-primary font-bold mb-3">You haven't applied to any jobs yet</h2>
            <p className="text-text-muted text-lg mb-8">
              Start applying to jobs and track your progress here. Our AI system will score your resume against job requirements to help you find the perfect match.
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-purple text-white font-bold rounded-lg px-8 py-3 hover:bg-purple/90 transition-all shadow-lg shadow-purple/20"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;

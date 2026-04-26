import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  return (
    <div className="bg-bg-main min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-text-primary font-bold text-3xl mb-8">My Applications</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Total Applied</h3>
            <p className="text-purple-light text-4xl font-bold">0</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Shortlisted</h3>
            <p className="text-purple-light text-4xl font-bold">0</p>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2 uppercase tracking-wider">Interviews</h3>
            <p className="text-purple-light text-4xl font-bold">0</p>
          </div>
        </div>

        {/* Applications Placeholder for Phase 3 */}
        <div className="bg-bg-card border border-border-purple rounded-xl p-10 text-center max-w-2xl mx-auto shadow-lg shadow-purple/5">
          <div className="w-16 h-16 bg-purple-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border-purple text-purple-light">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl text-text-primary font-bold mb-3">Ready for your next opportunity?</h2>
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
      </div>
    </div>
  );
};

export default CandidateDashboard;

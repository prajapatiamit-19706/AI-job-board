import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col bg-bg-main">
      {/* Hero Section */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto w-full px-6 py-20 min-h-[calc(100vh-73px)]">
        <div className="flex-1 pr-12">
          <div className="inline-block bg-purple-muted text-purple-light border border-border-purple rounded-full px-4 py-1 text-sm mb-6">
            ✦ AI-Powered Job Matching
          </div>
          <h1 className="text-5xl font-bold text-text-primary leading-tight mb-6">
            Find Your Dream <span className="text-purple-light">Job</span><br/>
            With <span className="text-purple-light">AI</span> Precision
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-md mb-8">
            Our AI analyzes your resume and matches you with the perfect roles.
            No more guesswork — just your best opportunities.
          </p>
          <div className="flex items-center gap-4 mb-12">
            <Link to="/jobs" className="bg-purple text-white font-bold rounded-lg px-6 py-3 hover:bg-purple/90 transition-all">
              Browse Jobs
            </Link>
            <Link to="/register" className="border border-purple/60 text-purple-light font-bold rounded-lg px-6 py-3 hover:bg-purple-muted transition-all">
              Post a Job
            </Link>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-text-primary font-bold text-2xl">500+</div>
              <div className="text-text-muted text-sm">Jobs</div>
            </div>
            <div>
              <div className="text-text-primary font-bold text-2xl">1000+</div>
              <div className="text-text-muted text-sm">Candidates</div>
            </div>
            <div>
              <div className="text-text-primary font-bold text-2xl">95%</div>
              <div className="text-text-muted text-sm">Match Rate</div>
            </div>
          </div>
        </div>

        {/* Floating Job Card Mockup */}
        <div className="flex-1 relative hidden lg:block">
          <div className="absolute inset-0 bg-purple/20 blur-3xl rounded-full opacity-30 transform -translate-y-10"></div>
          <div className="relative bg-bg-card border border-border-soft rounded-2xl p-6 shadow-[0_0_50px_rgba(124,58,237,0.1)] transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-text-primary font-bold text-xl mb-1">Senior Frontend Developer</h3>
                <p className="text-text-muted text-sm">TechCorp Inc. • Remote</p>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#27272A"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-purple-light font-bold text-lg">92</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-bg-surface rounded-lg p-3">
                <div className="text-xs text-text-hint mb-2 uppercase font-bold tracking-wider">Matched Skills</div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind', 'Zustand'].map(skill => (
                    <span key={skill} className="bg-purple-muted text-purple-light border border-border-purple rounded-full px-2 py-1 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-bg-surface rounded-lg p-3">
                <div className="text-xs text-text-hint mb-1 uppercase font-bold tracking-wider">AI Recommendation</div>
                <p className="text-text-primary text-sm leading-relaxed">
                  Strong candidate with excellent modern frontend stack experience. Highly recommended for an interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 bg-bg-card border-t border-border-soft">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-text-primary font-bold text-3xl mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-main border border-border-soft rounded-xl p-8 text-center">
              <div className="mx-auto bg-purple-muted text-purple-light w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-text-primary font-bold text-lg mb-3">Upload Your Resume</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Submit your PDF resume when applying to any job. Our system securely stores and parses it.
              </p>
            </div>
            <div className="bg-bg-main border border-border-soft rounded-xl p-8 text-center">
              <div className="mx-auto bg-purple-muted text-purple-light w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-text-primary font-bold text-lg mb-3">AI Analyzes Your Profile</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Our AI scores your resume against job requirements instantly, checking skills and experience.
              </p>
            </div>
            <div className="bg-bg-main border border-border-soft rounded-xl p-8 text-center">
              <div className="mx-auto bg-purple-muted text-purple-light w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-text-primary font-bold text-lg mb-3">Get Matched</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                See your match score and apply to jobs where you'll succeed. Employers get the best candidates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bg-card border-t border-border-soft py-10 text-center">
        <div className="text-purple-light font-bold text-lg mb-2">AI Job Board</div>
        <div className="text-text-hint text-sm mb-4">Built with MERN Stack + Groq AI</div>
        <div className="text-text-hint text-xs opacity-70">© {new Date().getFullYear()} AI Job Board. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;

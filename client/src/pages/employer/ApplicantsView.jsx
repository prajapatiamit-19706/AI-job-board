import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { useGetJobApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useGetJobById } from '../../hooks/useJobs';
import { useAIScoreSocket } from '../../hooks/useSocket';
import AIScoreCard from '../../components/employer/AIScoreCard';

const ApplicantsView = () => {
    const { jobId } = useParams();
    const { data: job } = useGetJobById(jobId);
    const { data: applications = [], isLoading } = useGetJobApplications(jobId);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState({});

    useAIScoreSocket(useCallback((data) => {
        queryClient.setQueryData(['job-applications', jobId], (old) => {
            if (!old) return old;
            return old.map(app =>
                app._id === data.applicationId
                    ? {
                        ...app,
                        aiScore: data.score,
                        aiSummary: data.summary,
                        aiSkillsMatched: data.skillsMatched,
                        aiSkillsMissing: data.skillsMissing,
                        aiExperienceMatch: data.experienceMatch,
                        aiRecommendation: data.recommendation,
                        aiScoredAt: new Date().toISOString()
                    }
                    : app
            );
        });
    }, [jobId, queryClient]));

    const handleStatusChange = (applicationId, status) => {
        updateStatus({ applicationId, status });
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

    const sortedApplications = [...applications].sort((a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1));

    return (
        <div className="bg-bg-main min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link
                    to="/employer/dashboard"
                    className="text-text-muted hover:text-text-primary mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <span>←</span> Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {job ? job.title : 'Loading job...'}
                    </h1>
                    <p className="text-text-muted">
                        {applications.length} applicants
                    </p>
                    {applications.some((app) => app.aiScore !== undefined && app.aiScore !== null) && (
                        <p className="text-text-hint text-xs mt-1">Sorted by AI match score</p>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-bg-card border border-border-soft rounded-xl p-5 h-24 animate-pulse" />
                        ))}
                    </div>
                ) : applications.length > 0 ? (
                    <div className="space-y-3">
                        {sortedApplications.map((app) => (
                            <div key={app._id} className="bg-bg-card border border-border-soft rounded-xl flex flex-col overflow-hidden">
                                <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-bg-surface text-purple-light flex items-center justify-center font-bold text-lg border border-border-soft flex-shrink-0">
                                            {(app.candidate?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-text-primary font-bold">{app.candidate?.name || 'Unknown Candidate'}</h3>
                                            <p className="text-text-muted text-sm">{app.candidate?.email || 'No email provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center flex-shrink-0 px-8 border-x border-border-soft min-w-[140px]">
                                        <button
                                            onClick={() => setExpanded(prev => ({ ...prev, [app._id]: !prev[app._id] }))}
                                            className="text-purple-light text-xs font-medium cursor-pointer hover:underline focus:outline-none mt-2"
                                        >
                                            {expanded[app._id] ? 'Hide Analysis ↑' : 'View AI Analysis ↓'}
                                        </button>
                                        {app.aiScore !== undefined && app.aiScore !== null && !expanded[app._id] && (
                                            <span className="text-text-hint text-xs mt-1">Score: {app.aiScore}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 flex-1 justify-end">
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 text-xs uppercase border rounded-full font-bold ${getStatusClasses(app.status)}`}>
                                                {app.status}
                                            </span>
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                disabled={isUpdating}
                                                className="bg-bg-surface border border-border-soft text-text-primary rounded-lg px-2 py-1 text-sm focus:border-purple focus:outline-none disabled:opacity-50"
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="interview">Interview</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="hired">Hired</option>
                                            </select>
                                        </div>

                                        {app.resumeUrl && (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg border border-purple/60 text-purple-light hover:bg-purple-muted transition-colors text-sm whitespace-nowrap"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {expanded[app._id] && (
                                    <div className="px-5 pb-5 border-t border-border-soft bg-bg-main/30">
                                        <AIScoreCard application={app} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-bg-card border border-border-soft rounded-xl p-10 text-center">
                        <h2 className="text-xl text-text-primary font-bold mb-2">No applicants yet for this job</h2>
                        <p className="text-text-muted">When candidates apply, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantsView;

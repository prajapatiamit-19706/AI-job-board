import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const fetchPublicProfile = async (userId) => {
    const { data } = await axiosInstance.get(`/api/profile/${userId}`);
    return data;
};

export default function CandidateProfileModal({ candidateId, onClose }) {
    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['public-profile', candidateId],
        queryFn: () => fetchPublicProfile(candidateId),
        enabled: !!candidateId,
    });

    if (!candidateId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative w-full max-w-3xl max-h-[85vh] bg-bg-card border border-border-soft rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-soft bg-bg-main/30">
                    <h2 className="text-xl font-bold text-text-primary">Candidate Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary text-xl p-1 rounded-lg hover:bg-bg-surface transition-colors cursor-pointer"
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-text-muted text-sm animate-pulse">Loading profile data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400">
                            <p>Failed to load candidate profile.</p>
                            <p className="text-xs text-text-muted mt-2">{error.response?.data?.message || error.message}</p>
                        </div>
                    ) : (
                        <>
                            {/* Personal Details Header */}
                            <div className="flex flex-col md:flex-row gap-6 items-start border-b border-border-soft pb-6">
                                <div className="w-24 h-24 rounded-full bg-bg-surface border-2 border-purple overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl font-bold text-purple-light shadow-lg shadow-purple/10">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        profile.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h3 className="text-2xl font-bold text-text-primary">{profile.name}</h3>
                                        {profile.isOpenToWork && (
                                            <span className="bg-purple/10 border border-purple/30 text-purple-light text-xs font-semibold px-3 py-1 rounded-full">
                                                ✓ Open to Work
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-purple-light font-medium text-sm md:text-base">{profile.headline || 'Candidate'}</p>
                                    <p className="text-text-muted text-sm">{profile.location || 'Location details not specified'}</p>
                                    
                                    {/* Links */}
                                    <div className="flex flex-wrap gap-4 pt-2 text-xs">
                                        {profile.email && (
                                            <span className="text-text-muted">
                                                📧 <a href={`mailto:${profile.email}`} className="hover:text-purple-light transition-colors">{profile.email}</a>
                                            </span>
                                        )}
                                        {profile.phone && (
                                            <span className="text-text-muted">
                                                📞 <span className="text-text-primary">{profile.phone}</span>
                                            </span>
                                        )}
                                        {profile.portfolioUrl && (
                                            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-light hover:underline font-medium">
                                                🔗 Portfolio ↗
                                            </a>
                                        )}
                                        {profile.githubUrl && (
                                            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-light hover:underline font-medium">
                                                💻 GitHub ↗
                                            </a>
                                        )}
                                        {profile.linkedinUrl && (
                                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-purple-light hover:underline font-medium">
                                                👔 LinkedIn ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <section className="space-y-2">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">About Me</h4>
                                    <div className="bg-bg-surface/30 border border-border-soft rounded-xl p-4">
                                        <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                                    </div>
                                </section>
                            )}

                            {/* Skills */}
                            <section className="space-y-2">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill) => (
                                            <span key={skill} className="bg-purple-muted border border-border-purple text-purple-light text-xs px-3 py-1.5 rounded-full font-medium">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-text-hint text-sm italic">No skills listed</p>
                                    )}
                                </div>
                            </section>

                            {/* Work Experience */}
                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Work Experience</h4>
                                {profile.experience && profile.experience.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.experience.map((exp, idx) => (
                                            <div key={idx} className="bg-bg-surface/30 border border-border-soft rounded-xl p-4 space-y-1">
                                                <div className="flex justify-between items-start flex-wrap gap-2">
                                                    <h5 className="font-bold text-text-primary text-sm md:text-base">{exp.title}</h5>
                                                    <span className="text-xs text-text-hint font-medium">
                                                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                                                    </span>
                                                </div>
                                                <p className="text-purple-light text-xs md:text-sm font-medium">{exp.company} <span className="text-text-muted font-normal">· {exp.location || 'Remote'}</span></p>
                                                {exp.description && (
                                                    <p className="text-text-muted text-xs md:text-sm pt-2 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-hint text-sm italic">No work experience listed</p>
                                )}
                            </section>

                            {/* Education */}
                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Education</h4>
                                {profile.education && profile.education.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.education.map((edu, idx) => (
                                            <div key={idx} className="bg-bg-surface/30 border border-border-soft rounded-xl p-4 space-y-1">
                                                <div className="flex justify-between items-start flex-wrap gap-2">
                                                    <h5 className="font-bold text-text-primary text-sm md:text-base">{edu.degree} in {edu.field}</h5>
                                                    <span className="text-xs text-text-hint font-medium">
                                                        {edu.startYear} – {edu.endYear || 'Present'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs md:text-sm flex-wrap gap-2">
                                                    <p className="text-purple-light font-medium">{edu.institution}</p>
                                                    {edu.grade && <span className="text-text-muted">Grade: {edu.grade}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-hint text-sm italic">No education details listed</p>
                                )}
                            </section>

                            {/* Projects */}
                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Projects</h4>
                                {profile.projects && profile.projects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {profile.projects.map((proj, idx) => (
                                            <div key={idx} className="bg-bg-surface/30 border border-border-soft rounded-xl p-4 flex flex-col justify-between space-y-3">
                                                <div className="space-y-2">
                                                    <h5 className="font-bold text-text-primary text-sm md:text-base">{proj.title}</h5>
                                                    {proj.description && (
                                                        <p className="text-text-muted text-xs md:text-sm leading-relaxed">{proj.description}</p>
                                                    )}
                                                    {proj.techStack && proj.techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {proj.techStack.map((tech) => (
                                                                <span key={tech} className="bg-bg-surface text-text-muted border border-border-soft text-[10px] px-2 py-0.5 rounded font-medium">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-4 text-xs pt-2">
                                                    {proj.liveUrl && (
                                                        <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-purple-light hover:underline font-semibold flex items-center gap-1">
                                                            Live Demo ↗
                                                        </a>
                                                    )}
                                                    {proj.githubUrl && (
                                                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-light hover:underline font-semibold flex items-center gap-1">
                                                            GitHub Repo ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-hint text-sm italic">No projects listed</p>
                                )}
                            </section>

                            {/* Job Preferences */}
                            <section className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Preferences & Metadata</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-surface/20 border border-border-soft rounded-xl p-4">
                                    <div>
                                        <p className="text-[10px] font-semibold text-text-hint uppercase tracking-wider">Job Type Preferred</p>
                                        <p className="text-sm font-semibold text-text-primary capitalize mt-0.5">{profile.jobType || 'Any'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-text-hint uppercase tracking-wider">Expected Salary</p>
                                        <p className="text-sm font-semibold text-text-primary mt-0.5">{profile.expectedSalary || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-text-hint uppercase tracking-wider">Profile Score</p>
                                        <p className="text-sm font-semibold text-purple-light mt-0.5">{profile.profileCompletionScore ?? 0}% Completed</p>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-soft bg-bg-main/30 flex justify-between items-center gap-4 flex-wrap">
                    {profile?.resumeUrl ? (
                        <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple hover:bg-purple/90 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md shadow-purple/10 transition cursor-pointer flex items-center gap-2"
                        >
                            <span>📥</span> View Candidate Resume
                        </a>
                    ) : (
                        <span className="text-text-hint text-xs italic">No resume uploaded</span>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-border-soft hover:bg-bg-surface text-text-muted hover:text-text-primary text-xs md:text-sm rounded-lg transition cursor-pointer"
                    >
                        Close Profile
                    </button>
                </div>

            </div>
        </div>
    );
}

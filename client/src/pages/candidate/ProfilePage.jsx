import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import useToastStore from '../../store/toastStore';

// ── API calls ─────────────────────────────────────────────────────
const fetchProfile = async () => {
    const { data } = await axiosInstance.get('/api/profile/me');
    return data;
};

const updateProfile = async (payload) => {
    const { data } = await axiosInstance.put('/api/profile/me', payload);
    return data;
};

const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await axiosInstance.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

// ── helpers ───────────────────────────────────────────────────────
const SKILL_SUGGESTIONS = [
    'React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript',
    'HTML', 'CSS', 'Tailwind CSS', 'Git', 'REST APIs', 'Socket.io',
    'Next.js', 'Redux', 'MySQL', 'PostgreSQL', 'Docker', 'AWS',
];

const emptyEducation = { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' };
const emptyExperience = { title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' };
const emptyProject = { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' };

// ── ProfilePage ───────────────────────────────────────────────────
export default function ProfilePage() {
    const qc = useQueryClient();
    const avatarRef = useRef();
    const [editing, setEditing] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [form, setForm] = useState(null);
    const { addToast } = useToastStore();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['my-profile'],
        queryFn: fetchProfile,
    });

    const saveMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-profile'] });
            setEditing(false);
            addToast('Profile saved!', 'success');
        },
        onError: (err) => addToast(err.response?.data?.message || 'Save failed', 'error'),
    });

    const avatarMutation = useMutation({
        mutationFn: uploadAvatar,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-profile'] });
            addToast('Avatar updated!', 'success');
        },
        onError: () => addToast('Avatar upload failed', 'error'),
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-main">
            <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const d = editing ? form : profile;
    if (!d) return null;

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleEdit = () => {
        setForm({ ...profile });
        setEditing(true);
    };

    const handleSave = () => {
        // Strip out the techStackString helper before mutating/sending payload
        const cleanedProjects = (form.projects || []).map(p => {
            const { techStackString, ...rest } = p;
            return rest;
        });

        saveMutation.mutate({
            name: form.name,
            headline: form.headline,
            bio: form.bio,
            phone: form.phone,
            location: form.location,
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            portfolioUrl: form.portfolioUrl,
            githubUrl: form.githubUrl,
            linkedinUrl: form.linkedinUrl,
            skills: form.skills,
            education: form.education,
            experience: form.experience,
            projects: cleanedProjects,
            expectedSalary: form.expectedSalary,
            jobType: form.jobType,
            isOpenToWork: form.isOpenToWork,
        });
    };

    // skill handlers
    const addSkill = (skill) => {
        const s = skill.trim();
        if (!s || form.skills?.includes(s)) return;
        set('skills', [...(form.skills || []), s]);
        setSkillInput('');
    };
    const removeSkill = (s) => set('skills', (form.skills || []).filter(x => x !== s));

    // education handlers
    const updateEdu = (i, key, val) => {
        const arr = [...(form.education || [])];
        arr[i] = { ...arr[i], [key]: val };
        set('education', arr);
    };
    const removeEdu = (i) => set('education', (form.education || []).filter((_, idx) => idx !== i));

    // experience handlers
    const updateExp = (i, key, val) => {
        const arr = [...(form.experience || [])];
        arr[i] = { ...arr[i], [key]: val };
        set('experience', arr);
    };
    const removeExp = (i) => set('experience', (form.experience || []).filter((_, idx) => idx !== i));

    // project handlers
    const updateProj = (i, key, val) => {
        const arr = [...(form.projects || [])];
        arr[i] = { ...arr[i], [key]: val };
        set('projects', arr);
    };
    const removeProj = (i) => set('projects', (form.projects || []).filter((_, idx) => idx !== i));

    return (
        <div className="min-h-screen bg-bg-main text-text-primary">
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-purple-light">My Profile</h1>
                    {!editing ? (
                        <button onClick={handleEdit}
                            className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/90 transition text-sm font-semibold shadow-md shadow-purple/10 cursor-pointer">
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={() => setEditing(false)}
                                className="px-4 py-2 border border-border-soft text-text-muted rounded-lg hover:bg-bg-surface hover:text-text-primary transition text-sm cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saveMutation.isPending}
                                className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/90 transition text-sm font-semibold disabled:opacity-50 cursor-pointer">
                                {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Profile Completion Bar ── */}
                <div className="bg-bg-card rounded-xl p-4 mb-6 border border-border-soft">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-muted">Profile Completion</span>
                        <span className="text-purple-light font-medium">{profile.profileCompletionScore ?? 0}%</span>
                    </div>
                    <div className="w-full bg-bg-surface rounded-full h-2">
                        <div className="bg-purple h-2 rounded-full transition-all duration-500"
                            style={{ width: `${profile.profileCompletionScore ?? 0}%` }} />
                    </div>
                    {(profile.profileCompletionScore ?? 0) < 100 && (
                        <p className="text-xs text-text-hint mt-2">Complete your profile to get more visibility to employers.</p>
                    )}
                </div>

                {/* ── Avatar + Basic Info ── */}
                <Section title="Personal Information">
                    <div className="flex gap-6 items-start mb-6">
                        {/* avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-bg-surface border-2 border-purple overflow-hidden">
                                {(d.avatar || profile.avatar) ? (
                                    <img src={d.avatar || profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-purple-light">
                                        {profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                                onChange={e => e.target.files[0] && avatarMutation.mutate(e.target.files[0])} />
                            <button onClick={() => avatarRef.current.click()}
                                className="absolute bottom-0 right-0 bg-purple text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-purple/90 transition cursor-pointer"
                                title="Change photo">✏️</button>
                        </div>

                        {/* name + headline */}
                        <div className="flex-1 space-y-3">
                            <Field label="Full Name" editing={editing}
                                value={d.name} display={<p className="text-lg font-semibold">{d.name}</p>}
                                input={<input className={input} value={form?.name || ''} onChange={e => set('name', e.target.value)} placeholder="Your full name" />} />
                            <Field label="Headline" editing={editing}
                                value={d.headline} display={<p className="text-text-primary">{d.headline || '—'}</p>}
                                input={<input className={input} value={form?.headline || ''} onChange={e => set('headline', e.target.value)} placeholder="e.g. MERN Stack Developer" />} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Email" editing={false} value={profile.email}
                            display={<p className="text-text-primary">{profile.email}</p>} input={null} />
                        <Field label="Phone" editing={editing} value={d.phone}
                            display={<p className="text-text-primary">{d.phone || '—'}</p>}
                            input={<input className={input} value={form?.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />} />
                        <Field label="Location" editing={editing} value={d.location}
                            display={<p className="text-text-primary">{d.location || '—'}</p>}
                            input={<input className={input} value={form?.location || ''} onChange={e => set('location', e.target.value)} placeholder="Ahmedabad, Gujarat" />} />
                        <Field label="Gender" editing={editing} value={d.gender}
                            display={<p className="text-text-primary capitalize">{d.gender?.replace(/_/g, ' ') || '—'}</p>}
                            input={
                                <select className={input} value={form?.gender || ''} onChange={e => set('gender', e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            } />
                    </div>

                    <div className="mt-4">
                        <Field label="About Me" editing={editing} value={d.bio}
                            display={<p className="text-text-primary leading-relaxed">{d.bio || '—'}</p>}
                            input={<textarea className={`${input} h-28 resize-none`} value={form?.bio || ''} onChange={e => set('bio', e.target.value)} placeholder="Write a short bio about yourself..." />} />
                    </div>
                </Section>

                {/* ── Online Presence ── */}
                <Section title="Online Presence">
                    <div className="space-y-3">
                        <Field label="Portfolio" editing={editing} value={d.portfolioUrl}
                            display={d.portfolioUrl ? <a href={d.portfolioUrl} target="_blank" rel="noreferrer" className="text-purple-light underline text-sm hover:text-purple transition">{d.portfolioUrl}</a> : <p className="text-text-hint">—</p>}
                            input={<input className={input} value={form?.portfolioUrl || ''} onChange={e => set('portfolioUrl', e.target.value)} placeholder="https://yourportfolio.com" />} />
                        <Field label="GitHub" editing={editing} value={d.githubUrl}
                            display={d.githubUrl ? <a href={d.githubUrl} target="_blank" rel="noreferrer" className="text-purple-light underline text-sm hover:text-purple transition">{d.githubUrl}</a> : <p className="text-text-hint">—</p>}
                            input={<input className={input} value={form?.githubUrl || ''} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/username" />} />
                        <Field label="LinkedIn" editing={editing} value={d.linkedinUrl}
                            display={d.linkedinUrl ? <a href={d.linkedinUrl} target="_blank" rel="noreferrer" className="text-purple-light underline text-sm hover:text-purple transition">{d.linkedinUrl}</a> : <p className="text-text-hint">—</p>}
                            input={<input className={input} value={form?.linkedinUrl || ''} onChange={e => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/username" />} />
                    </div>
                </Section>

                {/* ── Skills ── */}
                <Section title="Skills">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {(editing ? form?.skills : profile.skills)?.map(s => (
                            <span key={s} className="flex items-center gap-1 bg-purple-muted border border-border-purple text-purple-light text-sm px-3 py-1 rounded-full">
                                {s}
                                {editing && (
                                    <button onClick={() => removeSkill(s)} className="text-purple-light hover:text-red-500 ml-1 text-xs cursor-pointer">✕</button>
                                )}
                            </span>
                        ))}
                        {!editing && !profile.skills?.length && <p className="text-text-hint text-sm">No skills added yet.</p>}
                    </div>
                    {editing && (
                        <div>
                            <div className="flex gap-2 mb-2">
                                <input className={`${input} flex-1`} value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                                    placeholder="Type a skill and press Enter" />
                                <button onClick={() => addSkill(skillInput)}
                                    className="px-3 py-2 bg-purple text-white rounded-lg text-sm hover:bg-purple/90 transition cursor-pointer">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {SKILL_SUGGESTIONS.filter(s => !form?.skills?.includes(s)).map(s => (
                                    <button key={s} onClick={() => addSkill(s)}
                                        className="text-xs bg-bg-surface border border-border-soft text-text-muted px-2 py-1 rounded-full hover:border-purple hover:text-purple-light transition cursor-pointer">
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Section>

                {/* ── Education ── */}
                <Section title="Education"
                    action={editing && <AddBtn onClick={() => set('education', [...(form.education || []), { ...emptyEducation }])} />}>
                    {(editing ? form?.education : profile.education)?.map((edu, i) => (
                        <div key={i} className="bg-bg-surface/50 border border-border-soft rounded-lg p-4 mb-3">
                            {editing ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={input} value={edu.degree || ''} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Degree (e.g. B.Sc)" />
                                        <input className={input} value={edu.field || ''} onChange={e => updateEdu(i, 'field', e.target.value)} placeholder="Field (e.g. CA & IT)" />
                                    </div>
                                    <input className={input} value={edu.institution || ''} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="Institution name" />
                                    <div className="grid grid-cols-3 gap-3">
                                        <input className={input} type="number" value={edu.startYear || ''} onChange={e => updateEdu(i, 'startYear', e.target.value)} placeholder="Start Year" />
                                        <input className={input} type="number" value={edu.endYear || ''} onChange={e => updateEdu(i, 'endYear', e.target.value)} placeholder="End Year" />
                                        <input className={input} value={edu.grade || ''} onChange={e => updateEdu(i, 'grade', e.target.value)} placeholder="Grade / CGPA" />
                                    </div>
                                    <button onClick={() => removeEdu(i)} className="text-red-500 text-sm hover:text-red-400 cursor-pointer">✕ Remove</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold text-text-primary">{edu.degree} in {edu.field}</p>
                                    <p className="text-text-muted text-sm">{edu.institution}</p>
                                    <p className="text-text-hint text-xs mt-1">{edu.startYear} – {edu.endYear || 'Present'} {edu.grade && `· ${edu.grade}`}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {!editing && !profile.education?.length && <p className="text-text-hint text-sm">No education added yet.</p>}
                </Section>

                {/* ── Experience ── */}
                <Section title="Work Experience"
                    action={editing && <AddBtn onClick={() => set('experience', [...(form.experience || []), { ...emptyExperience }])} />}>
                    {(editing ? form?.experience : profile.experience)?.map((exp, i) => (
                        <div key={i} className="bg-bg-surface/50 border border-border-soft rounded-lg p-4 mb-3">
                            {editing ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={input} value={exp.title || ''} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Job Title" />
                                        <input className={input} value={exp.company || ''} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company Name" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <input className={input} value={exp.location || ''} onChange={e => updateExp(i, 'location', e.target.value)} placeholder="Location" />
                                        <input className={input} type="month" value={exp.startDate || ''} onChange={e => updateExp(i, 'startDate', e.target.value)} />
                                        <input className={input} type="month" value={exp.endDate || ''} onChange={e => updateExp(i, 'endDate', e.target.value)} disabled={exp.isCurrent} />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                                        <input type="checkbox" checked={exp.isCurrent || false} onChange={e => updateExp(i, 'isCurrent', e.target.checked)} className="accent-purple" />
                                        Currently working here
                                    </label>
                                    <textarea className={`${input} h-20 resize-none`} value={exp.description || ''} onChange={e => updateExp(i, 'description', e.target.value)} placeholder="Describe your responsibilities..." />
                                    <button onClick={() => removeExp(i)} className="text-red-500 text-sm hover:text-red-400 cursor-pointer">✕ Remove</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold text-text-primary">{exp.title}</p>
                                    <p className="text-text-muted text-sm">{exp.company} · {exp.location}</p>
                                    <p className="text-text-hint text-xs mt-1">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</p>
                                    {exp.description && <p className="text-text-muted text-sm mt-2">{exp.description}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                    {!editing && !profile.experience?.length && <p className="text-text-hint text-sm">No experience added yet.</p>}
                </Section>

                {/* ── Projects ── */}
                <Section title="Projects"
                    action={editing && <AddBtn onClick={() => set('projects', [...(form.projects || []), { ...emptyProject }])} />}>
                    {(editing ? form?.projects : profile.projects)?.map((proj, i) => (
                        <div key={i} className="bg-bg-surface/50 border border-border-soft rounded-lg p-4 mb-3">
                            {editing ? (
                                <div className="space-y-3">
                                    <input className={input} value={proj.title || ''} onChange={e => updateProj(i, 'title', e.target.value)} placeholder="Project Name" />
                                    <textarea className={`${input} h-20 resize-none`} value={proj.description || ''} onChange={e => updateProj(i, 'description', e.target.value)} placeholder="What does this project do?" />
                                    <input 
                                        className={input} 
                                        value={proj.techStackString !== undefined ? proj.techStackString : (proj.techStack?.join(', ') || '')} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            updateProj(i, 'techStackString', val);
                                            updateProj(i, 'techStack', val.split(',').map(s => s.trim()).filter(Boolean));
                                        }} 
                                        placeholder="Tech stack (comma separated)" 
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={input} value={proj.liveUrl || ''} onChange={e => updateProj(i, 'liveUrl', e.target.value)} placeholder="Live URL" />
                                        <input className={input} value={proj.githubUrl || ''} onChange={e => updateProj(i, 'githubUrl', e.target.value)} placeholder="GitHub URL" />
                                    </div>
                                    <button onClick={() => removeProj(i)} className="text-red-500 text-sm hover:text-red-400 cursor-pointer">✕ Remove</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold text-text-primary">{proj.title}</p>
                                    {proj.description && <p className="text-text-muted text-sm mt-1">{proj.description}</p>}
                                    {proj.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {proj.techStack.map(t => (
                                                <span key={t} className="text-xs bg-bg-surface text-text-muted px-2 py-0.5 rounded border border-border-soft">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-4 mt-2">
                                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-purple-light text-xs underline hover:text-purple transition">Live ↗</a>}
                                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-purple-light text-xs underline hover:text-purple transition">GitHub ↗</a>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {!editing && !profile.projects?.length && <p className="text-text-hint text-sm">No projects added yet.</p>}
                </Section>

                {/* ── Job Preferences ── */}
                <Section title="Job Preferences">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Expected Salary" editing={editing} value={d.expectedSalary}
                            display={<p className="text-text-primary">{d.expectedSalary || '—'}</p>}
                            input={<input className={input} value={form?.expectedSalary || ''} onChange={e => set('expectedSalary', e.target.value)} placeholder="e.g. 4-6 LPA" />} />
                        <Field label="Job Type" editing={editing} value={d.jobType}
                            display={<p className="text-text-primary capitalize">{d.jobType || '—'}</p>}
                            input={
                                <select className={input} value={form?.jobType || ''} onChange={e => set('jobType', e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="internship">Internship</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            } />
                    </div>
                    {editing && (
                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                            <div className={`w-10 h-6 rounded-full transition-colors ${form?.isOpenToWork ? 'bg-purple' : 'bg-bg-surface'}`}
                                onClick={() => set('isOpenToWork', !form.isOpenToWork)}>
                                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${form?.isOpenToWork ? 'translate-x-5' : 'translate-x-1'}`} />
                            </div>
                            <span className="text-sm text-text-muted">Open to work</span>
                        </label>
                    )}
                    {!editing && (
                        <div className="mt-3">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${profile.isOpenToWork ? 'bg-purple/10 border border-purple/30 text-purple-light' : 'bg-bg-surface border border-border-soft text-text-hint'}`}>
                                {profile.isOpenToWork ? '✓ Open to work' : 'Not actively looking'}
                            </span>
                        </div>
                    )}
                </Section>

            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────
const input = 'w-full bg-bg-surface border border-border-soft text-text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple transition placeholder-text-hint';

function Section({ title, children, action }) {
    return (
        <div className="bg-bg-card border border-border-soft rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-text-primary">{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}

function Field({ label, editing, value, display, input: inputEl }) {
    return (
        <div>
            <label className="block text-xs text-text-muted mb-1">{label}</label>
            {editing && inputEl ? inputEl : display}
        </div>
    );
}

function AddBtn({ onClick }) {
    return (
        <button onClick={onClick}
            className="text-sm text-purple-light hover:text-purple transition flex items-center gap-1 cursor-pointer">
            + Add
        </button>
    );
}
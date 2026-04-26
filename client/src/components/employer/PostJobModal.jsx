import { useState } from 'react';
import { useCreateJob } from '../../hooks/useJobs';

const PostJobModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skills: [],
    location: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
  });
  const [skillInput, setSkillInput] = useState('');
  
  const createJobMutation = useCreateJob();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, type });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process requirements split by newline
    const requirementsArray = formData.requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0);

    const payload = {
      title: formData.title,
      description: formData.description,
      requirements: requirementsArray,
      skills: formData.skills,
      location: formData.location,
      type: formData.type,
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        currency: 'USD'
      }
    };

    createJobMutation.mutate(payload, {
      onSuccess: () => {
        // Reset form
        setFormData({
          title: '',
          description: '',
          requirements: '',
          skills: [],
          location: '',
          type: 'full-time',
          salaryMin: '',
          salaryMax: '',
        });
        setSkillInput('');
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-bg-card border border-border-soft rounded-2xl p-6 w-full max-w-2xl my-auto shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-bg-card pb-4 border-b border-border-soft z-10">
          <h2 className="text-2xl text-text-primary font-bold">Post New Job</h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-bg-surface transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {createJobMutation.isError && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl p-4 mb-6 text-sm">
            {createJobMutation.error?.response?.data?.message || 'Failed to post job. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Job Type *</label>
            <div className="flex flex-wrap gap-3">
              {['full-time', 'part-time', 'remote', 'internship'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all capitalize ${
                    formData.type === type
                      ? 'bg-purple text-white shadow-md border border-purple'
                      : 'bg-bg-surface text-text-muted border border-border-soft hover:border-purple/50'
                  }`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
              placeholder="e.g. New York, NY (or Remote)"
            />
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-3 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors resize-y custom-scrollbar"
              placeholder="Describe the role, responsibilities, and team..."
            />
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-3 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors resize-y custom-scrollbar"
              placeholder="Enter each requirement on a new line..."
            />
            <p className="text-text-hint text-xs mt-1">Enter each requirement on a new line.</p>
          </div>

          <div>
            <label className="block text-text-muted mb-1 text-sm font-medium">Skills</label>
            <div className="w-full bg-bg-surface border border-border-soft rounded-lg p-2 focus-within:border-purple transition-colors flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-purple-muted text-purple-light border border-border-purple rounded-full px-3 py-1 text-xs flex items-center gap-1"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="hover:text-white focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 min-w-[120px] bg-transparent border-none text-text-primary placeholder:text-text-hint focus:outline-none px-2 py-1 text-sm"
                placeholder={formData.skills.length === 0 ? "Type skill and press Enter" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted mb-1 text-sm font-medium">Minimum Salary (USD)</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                min="0"
                className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
                placeholder="e.g. 80000"
              />
            </div>
            <div>
              <label className="block text-text-muted mb-1 text-sm font-medium">Maximum Salary (USD)</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                min="0"
                className="w-full bg-bg-surface border border-border-soft rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-hint focus:border-purple outline-none transition-colors"
                placeholder="e.g. 120000"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border-soft sticky bottom-0 bg-bg-card pb-2 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={createJobMutation.isLoading}
              className="flex-1 border border-purple/60 text-purple-light rounded-lg py-3 font-bold hover:bg-purple-muted transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createJobMutation.isLoading}
              className="flex-1 bg-purple text-white font-bold rounded-lg py-3 hover:bg-purple/90 transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {createJobMutation.isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;

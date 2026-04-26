import React, { useState, useRef } from 'react';
import { useApplyToJob } from '../../hooks/useApplications';

const ApplyModal = ({ isOpen, onClose, jobId, jobTitle, companyName }) => {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  const { mutate: applyToJob, isPending } = useApplyToJob();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Resume is required');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    if (coverLetter) {
      formData.append('coverLetter', coverLetter);
    }

    applyToJob(
      { jobId, formData },
      {
        onSuccess: () => {
          setSuccess('Application submitted successfully!');
          setTimeout(() => {
            setSuccess('');
            onClose();
          }, 2000);
        },
        onError: (err) => {
          setError(err.response?.data?.message || 'Failed to submit application');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border-soft rounded-2xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          &times;
        </button>
        <h2 className="text-text-primary font-bold text-2xl mb-1">Apply for {jobTitle}</h2>
        <p className="text-text-muted text-sm mb-4">{companyName}</p>
        <hr className="border-border-soft mb-6" />

        {error && <div className="mb-4 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-text-muted text-sm mb-2">Resume (PDF only, max 5MB)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer dashed border border-border-purple rounded-xl p-8 text-center hover:bg-purple-muted transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="text-text-primary font-medium">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ) : (
                <div className="text-purple-light">
                  Click to select a file or drag and drop
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-text-muted text-sm mb-2">Cover Letter (optional)</label>
            <textarea
              className="w-full bg-bg-surface border-border-soft border rounded-lg p-3 text-text-primary focus:border-purple focus:outline-none placeholder:text-text-hint"
              rows="4"
              placeholder="Tell the employer why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-purple/60 text-purple-light hover:bg-purple-muted transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple text-white hover:bg-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;

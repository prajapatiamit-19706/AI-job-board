import { Link } from 'react-router-dom';

const JobCard = ({ job, aiScore }) => {
  const initials = job?.employer?.companyName
    ? job.employer.companyName.substring(0, 2).toUpperCase()
    : job?.employer?.name?.substring(0, 2).toUpperCase() || 'AJ';

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `${currency} ${min.toLocaleString()}+`;
    if (!min && max) return `Up to ${currency} ${max.toLocaleString()}`;
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'border-purple text-purple-light';
    if (score >= 50) return 'border-border-soft text-text-muted';
    return 'border-red-800 text-red-400';
  };

  return (
    <div className="bg-bg-card border border-border-soft rounded-xl p-5 hover:border-purple/40 transition-all flex flex-col h-full cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {job?.employer?.companyLogo ? (
            <img 
              src={job.employer.companyLogo} 
              alt={job.employer.companyName} 
              className="w-12 h-12 rounded-full object-cover border border-border-soft"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-bg-surface text-purple-light flex items-center justify-center font-bold border border-border-soft">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-text-primary font-bold text-base line-clamp-1">{job.title}</h3>
            <p className="text-text-muted text-sm line-clamp-1">
              {job?.employer?.companyName || job?.employer?.name} • {job.location || 'Remote'}
            </p>
          </div>
        </div>

        {aiScore !== undefined && (
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${getScoreColor(aiScore)}`}>
            {aiScore}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 flex-1">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-purple-muted text-purple-light border border-border-purple rounded-full px-3 py-1 text-xs whitespace-nowrap">
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs whitespace-nowrap">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto border-t border-border-soft pt-4">
        <div>
          <p className="text-purple-light font-semibold text-sm">
            {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
          </p>
          <span className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs inline-block mt-2 capitalize">
            {job.type.replace('-', ' ')}
          </span>
        </div>
        <Link 
          to={`/jobs/${job._id}`}
          className="border border-purple/60 text-purple-light rounded-lg hover:bg-purple-muted transition-all px-4 py-2 text-sm font-medium"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};

export default JobCard;

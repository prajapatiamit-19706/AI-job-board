import { formatDistanceToNow } from 'date-fns';

const AIScoreCard = ({ application }) => {
  const {
    aiScore,
    aiSummary,
    aiSkillsMatched,
    aiSkillsMissing,
    aiExperienceMatch,
    aiRecommendation,
    aiScoredAt,
  } = application;

  if (aiScore === undefined || aiScore === null) {
    return (
      <div className="bg-bg-card border border-border-soft rounded-xl p-5 mt-4">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple border-border-soft animate-spin"></div>
          <p className="text-text-hint text-sm animate-pulse">AI is analyzing this resume...</p>
        </div>
      </div>
    );
  }

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'border-purple text-purple-light';
    if (score >= 50) return 'border-border-soft text-text-muted';
    return 'border-red-800/60 text-red-400';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-purple';
    if (score >= 50) return 'bg-text-hint';
    return 'bg-red-800/60';
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'hire':
        return {
          classes: 'bg-green-500/10 text-green-400 border-green-500/20',
          text: 'Recommended to Hire',
        };
      case 'consider':
        return {
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          text: 'Worth Considering',
        };
      case 'reject':
        return {
          classes: 'bg-red-500/10 text-red-400 border-red-500/20',
          text: 'Not Recommended',
        };
      default:
        return { classes: 'bg-bg-surface text-text-muted border-border-soft', text: 'Unknown' };
    }
  };

  const getExperiencePill = (exp) => {
    switch (exp) {
      case 'strong':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'weak':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-bg-surface text-text-muted border-border-soft';
    }
  };

  const recBadge = getRecommendationBadge(aiRecommendation);

  return (
    <div className="bg-bg-card border border-border-soft rounded-xl p-5 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-2xl ${getScoreColorClass(
              aiScore
            )}`}
          >
            {aiScore}
          </div>
          <div className="flex flex-col">
            <span className="text-text-primary font-bold text-lg">AI Match Score</span>
            <span className="text-text-hint text-xs">Based on job requirements</span>
          </div>
        </div>
        <div className={`px-4 py-2 border rounded-full text-sm font-medium ${recBadge.classes}`}>
          {recBadge.text}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-muted text-sm">Match strength</span>
          <span className="text-text-primary font-bold">{aiScore}%</span>
        </div>
        <div className="bg-bg-surface rounded-full h-2 w-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getProgressBarColor(aiScore)}`}
            style={{ width: `${aiScore}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-text-muted text-sm">Experience match:</span>
        <span
          className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${getExperiencePill(
            aiExperienceMatch
          )}`}
        >
          {aiExperienceMatch}
        </span>
      </div>

      <div className="mb-6">
        <h4 className="text-text-muted text-sm font-medium mb-2">AI Assessment</h4>
        <div className="bg-bg-surface rounded-lg p-3">
          <p className="text-text-hint text-sm leading-relaxed italic">{aiSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <h4 className="text-green-400 text-xs font-medium uppercase tracking-wider mb-3">Skills matched</h4>
          <div className="flex flex-wrap gap-2">
            {aiSkillsMatched && aiSkillsMatched.length > 0 ? (
              aiSkillsMatched.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-text-hint text-xs">No key skills matched</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-red-400 text-xs font-medium uppercase tracking-wider mb-3">Skills missing</h4>
          <div className="flex flex-wrap gap-2">
            {aiSkillsMissing && aiSkillsMissing.length > 0 ? (
              aiSkillsMissing.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-green-400 text-xs">No critical gaps found</span>
            )}
          </div>
        </div>
      </div>

      {aiScoredAt && (
        <div className="text-right mt-2">
          <span className="text-text-hint text-xs">
            Scored {formatDistanceToNow(new Date(aiScoredAt), { addSuffix: true })}
          </span>
        </div>
      )}
    </div>
  );
};

export default AIScoreCard;

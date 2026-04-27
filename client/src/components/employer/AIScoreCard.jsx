import { formatDistanceToNow } from 'date-fns';

const AIScoreCard = ({ application }) => {
  if (application.aiScore === null || application.aiScore === undefined) {
    return (
      <div className="bg-bg-card border border-border-soft rounded-xl p-5 mt-3">
        <div className="text-center py-4">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-light border-bg-surface animate-spin mx-auto"></div>
          <p className="text-text-hint text-sm text-center mt-3 animate-pulse">AI is analyzing this resume...</p>
          <p className="text-text-hint text-xs text-center mt-1">This usually takes 10–20 seconds</p>
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

  const recBadge = getRecommendationBadge(application.aiRecommendation);

  return (
    <div className="bg-bg-card border border-border-soft rounded-xl p-5 mt-3">
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-col ${getScoreColorClass(application.aiScore)}`}>
            <span className="text-2xl font-bold leading-none">{application.aiScore}</span>
            <span className="text-text-hint text-[10px] leading-none mt-1">/ 100</span>
          </div>
          <span className="text-text-hint text-xs text-center mt-1 font-medium tracking-wide">AI Match</span>
        </div>
        
        <div className={`rounded-full px-3 py-1 text-xs font-medium border ${recBadge.classes}`}>
          {recBadge.text}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-text-muted text-sm font-medium">Match strength</span>
          <span className="text-text-hint text-xs font-bold">{application.aiScore}%</span>
        </div>
        <div className="w-full bg-bg-surface rounded-full h-2">
          <div 
            className={`transition-all duration-700 rounded-full h-2 ${getProgressBarColor(application.aiScore)}`}
            style={{ width: `${application.aiScore}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-text-muted text-sm">Experience:</span>
        <span className={`rounded-full px-2 py-1 text-xs capitalize border ${getExperiencePill(application.aiExperienceMatch)}`}>
          {application.aiExperienceMatch || 'unknown'}
        </span>
      </div>

      <div className="mt-3">
        <h4 className="text-text-muted text-xs font-medium uppercase tracking-wide">AI Assessment</h4>
        <div className="bg-bg-surface rounded-lg p-3 mt-1">
          <p className="text-text-hint text-sm leading-relaxed italic">{application.aiSummary}</p>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-green-400 text-xs font-medium mb-2">✓ Skills Matched</h4>
        <div className="flex flex-wrap gap-2">
          {application.aiSkillsMatched && application.aiSkillsMatched.length > 0 ? (
            application.aiSkillsMatched.map((skill, idx) => (
              <span key={idx} className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-1 text-xs">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-text-hint text-xs">No matched skills detected</span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-red-400 text-xs font-medium mb-2">✕ Skills Missing</h4>
        <div className="flex flex-wrap gap-2">
          {application.aiSkillsMissing && application.aiSkillsMissing.length > 0 ? (
            application.aiSkillsMissing.map((skill, idx) => (
              <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-1 text-xs">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-green-400 text-xs">No critical gaps found ✓</span>
          )}
        </div>
      </div>

      {application.aiScoredAt && (
        <div className="mt-3 text-right">
          <span className="text-text-hint text-xs">
            Scored {formatDistanceToNow(new Date(application.aiScoredAt))} ago
          </span>
        </div>
      )}
    </div>
  );
};

export default AIScoreCard;

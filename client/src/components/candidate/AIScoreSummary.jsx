import { useState } from 'react';

const AIScoreSummary = ({ application }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'border-purple text-purple-light';
    if (score >= 50) return 'border-border-soft text-text-muted';
    return 'border-red-800/60 text-red-400';
  };

  return (
    <div className="mt-4 border-t border-border-soft pt-3">
      <div 
        className="text-purple-light text-xs cursor-pointer inline-flex items-center gap-1 hover:underline font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide AI Feedback ↑' : 'View AI Feedback ↓'}
      </div>

      {expanded && (
        <div className="bg-bg-surface rounded-lg p-3 mt-2 space-y-2 border border-border-soft">
          {application.aiScore === null || application.aiScore === undefined ? (
            <p className="text-text-hint text-xs animate-pulse font-medium">AI analysis pending...</p>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 ${getScoreColorClass(application.aiScore)}`}>
                  {application.aiScore}
                </div>
                <p className="text-text-hint text-xs italic leading-relaxed pt-1">
                  {application.aiSummary}
                </p>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {application.aiSkillsMatched?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5 text-[10px]">
                      ✓ {skill}
                    </span>
                  ))}
                  {application.aiSkillsMatched?.length > 3 && (
                    <span className="text-text-hint text-[10px] self-center ml-1">+{application.aiSkillsMatched.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {application.aiSkillsMissing?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 text-[10px]">
                      ✕ {skill}
                    </span>
                  ))}
                  {application.aiSkillsMissing?.length > 3 && (
                    <span className="text-text-hint text-[10px] self-center ml-1">+{application.aiSkillsMissing.length - 3} more</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIScoreSummary;

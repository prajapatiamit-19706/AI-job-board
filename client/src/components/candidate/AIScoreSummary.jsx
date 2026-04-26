import { useState } from 'react';

const AIScoreSummary = ({ application }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    aiScore,
    aiSummary,
    aiSkillsMatched,
    aiSkillsMissing,
  } = application;

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'border-purple text-purple-light';
    if (score >= 50) return 'border-border-soft text-text-muted';
    return 'border-red-800/60 text-red-400';
  };

  return (
    <div className="mt-4 border-t border-border-soft pt-3">
      <div 
        className="text-purple-light text-xs cursor-pointer inline-flex items-center gap-1 hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        <span>{expanded ? 'Hide AI Feedback ↑' : 'View AI Feedback ↓'}</span>
      </div>

      {expanded && (
        <div className="bg-bg-surface rounded-lg p-3 mt-2">
          {aiScore === undefined || aiScore === null ? (
            <p className="text-text-hint text-xs animate-pulse">AI analysis pending...</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getScoreColorClass(aiScore)}`}>
                  {aiScore}
                </div>
                <div>
                  <span className="text-text-primary text-sm font-bold block">Match score</span>
                </div>
              </div>
              
              <p className="italic text-text-hint text-xs leading-relaxed">
                {aiSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h5 className="text-[10px] text-green-400 font-bold uppercase mb-1">Matched Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {aiSkillsMatched?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5 text-[10px]">
                        ✓ {skill}
                      </span>
                    ))}
                    {aiSkillsMatched?.length > 3 && (
                      <span className="text-text-hint text-[10px] self-center">+{aiSkillsMatched.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-[10px] text-red-400 font-bold uppercase mb-1">Missing Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {aiSkillsMissing?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 text-[10px]">
                        ✕ {skill}
                      </span>
                    ))}
                    {(!aiSkillsMissing || aiSkillsMissing.length === 0) && (
                      <span className="text-green-400 text-[10px]">None</span>
                    )}
                    {aiSkillsMissing?.length > 3 && (
                      <span className="text-text-hint text-[10px] self-center">+{aiSkillsMissing.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIScoreSummary;

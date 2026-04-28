import React, { useState, useEffect } from 'react';
import { useGetCandidateQuestions } from '../../hooks/useInterviewQuestions';

export default function InterviewPrepCard({ applicationId, jobTitle }) {
  const { data: response } = useGetCandidateQuestions(applicationId);
  const data = response?.data;
  
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [studied, setStudied] = useState([]);
  const [justAppeared, setJustAppeared] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`studied-${applicationId}`);
    if (saved) {
      try {
        setStudied(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse studied array');
      }
    }
  }, [applicationId]);

  useEffect(() => {
    if (studied.length > 0) {
      localStorage.setItem(`studied-${applicationId}`, JSON.stringify(studied));
    } else {
      localStorage.removeItem(`studied-${applicationId}`);
    }
  }, [studied, applicationId]);

  useEffect(() => {
    const timer = setTimeout(() => setJustAppeared(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!data || !data.questions || data.questions.length === 0) {
    return null;
  }

  const { questions, aiScore } = data;
  
  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'All') return true;
    return q.category.toLowerCase() === activeTab.toLowerCase();
  });

  const toggleStudied = (index) => {
    setStudied(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      return [...prev, index];
    });
  };

  const studiedCount = studied.length;
  const total = questions.length;
  const progressPercent = total > 0 ? (studiedCount / total) * 100 : 0;

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'bg-green-500/10 text-green-400 border border-green-500/20';
    if (diff === 'medium') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  };

  const getCategoryColor = (cat) => {
    if (cat === 'technical') return 'bg-purple-muted text-purple-light border border-border-purple';
    if (cat === 'behavioral') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  };

  return (
    <div className="mt-4 pt-4 border-t border-border-soft">
      <div 
        className={`text-purple-light text-xs font-medium cursor-pointer flex items-center gap-1 ${justAppeared ? 'animate-pulse' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        📋 Interview Prep Questions Available
        <span className="text-text-hint ml-1">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          {/* Header Card */}
          <div className="bg-purple-muted border border-border-purple rounded-xl p-4">
            <h4 className="text-purple-light font-bold text-sm flex items-center gap-2">
              🎯 Your Interview Prep Guide
            </h4>
            <p className="text-text-muted text-xs leading-relaxed mt-1">
              The employer has shared {total} preparation questions for your {jobTitle} interview. Study these carefully!
            </p>
            {aiScore !== undefined && (
              <div className="bg-bg-surface text-text-muted border border-border-soft rounded-full px-3 py-1 text-xs mt-3 inline-block">
                Your Match Score: {aiScore}/100
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 mt-3">
            {['All', 'Technical', 'Behavioral', 'Gap-based'].map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1 text-xs transition-all ${
                    isActive 
                      ? 'bg-purple text-white font-bold' 
                      : 'bg-bg-surface text-text-muted hover:bg-bg-card'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Questions List */}
          <div className="max-h-80 overflow-y-auto space-y-2 mt-3 pr-2 scrollbar-thin scrollbar-track-bg-surface scrollbar-thumb-purple/40">
            {filteredQuestions.map((q, filteredIdx) => {
              const originalIndex = questions.indexOf(q);
              const isStudied = studied.includes(originalIndex);
              
              return (
                <div key={originalIndex} className="bg-bg-surface rounded-xl p-3 flex gap-3 items-start">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={isStudied}
                      onChange={() => toggleStudied(originalIndex)}
                      className="accent-purple w-3 h-3 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-purple-light text-xs font-bold w-5 h-5 bg-bg-card rounded-full flex items-center justify-center">
                        {originalIndex + 1}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getCategoryColor(q.category)}`}>
                        {q.category}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed font-medium transition-all ${isStudied ? 'text-text-hint line-through opacity-50' : 'text-text-primary'}`}>
                      {q.question}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-text-hint text-xs">Studied {studiedCount} of {total}</span>
              {studiedCount === total && (
                <span className="text-green-400 text-xs">✓ Great preparation! You've reviewed all questions 🚀</span>
              )}
            </div>
            <div className="w-full bg-bg-surface rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Tip Box */}
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 mt-3">
            <p className="text-amber-400 text-xs font-bold mb-1 flex items-center gap-1">
              💡 Pro tip:
            </p>
            <p className="text-text-hint text-xs leading-relaxed">
              Gap-based questions target skills you're still developing. Research these topics before your interview!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

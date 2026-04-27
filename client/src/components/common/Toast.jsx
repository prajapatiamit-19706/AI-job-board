import React from 'react';

const Toast = ({ message, type, onClose }) => {
  let styles = 'bg-bg-card border-border-soft text-text-primary';
  
  if (type === 'success') {
    styles = 'bg-green-500/10 border border-green-500/20 text-green-400';
  } else if (type === 'error') {
    styles = 'bg-red-500/10 border border-red-500/20 text-red-400';
  } else if (type === 'info') {
    styles = 'bg-purple-muted border border-border-purple text-purple-light';
  }

  return (
    <div className={`p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 w-80 transition-all duration-300 transform translate-y-0 opacity-100 ${styles}`}>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none">
        ✕
      </button>
    </div>
  );
};

export default Toast;

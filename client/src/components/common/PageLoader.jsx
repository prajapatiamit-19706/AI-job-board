import React from 'react';

const PageLoader = () => {
  return (
    <div className="bg-bg-main min-h-[50vh] flex flex-col items-center justify-center flex-1">
      <div className="w-12 h-12 rounded-full border-2 border-bg-surface border-t-purple animate-spin"></div>
      <p className="text-text-hint text-sm mt-4">Loading...</p>
    </div>
  );
};

export default PageLoader;

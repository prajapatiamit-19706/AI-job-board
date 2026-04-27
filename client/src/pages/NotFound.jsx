import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-bold text-purple-light opacity-20 mb-4">404</div>
      <h1 className="text-text-primary font-bold text-2xl mb-2">Page not found</h1>
      <p className="text-text-muted mb-8">The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="bg-purple text-white font-bold rounded-lg px-6 py-3 hover:bg-purple/90 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

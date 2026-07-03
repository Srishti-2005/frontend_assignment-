import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="app-container">
      <main className="main-content not-found-container">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-text">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="detail-back-link" style={{ fontSize: '1.125rem' }}>
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>
      </main>
    </div>
  );
};

export default NotFound;

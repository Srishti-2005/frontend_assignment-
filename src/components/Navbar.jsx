import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Home, Compass } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
          <Compass size={24} className="brand-icon" style={{ color: 'var(--color-primary)' }} />
          Go Business
        </Link>
        <div className="navbar-nav" aria-label="Primary">
          <Link to="/" className="navbar-link">
            <Home size={18} />
            Home
          </Link>
          <button onClick={handleLogout} className="navbar-logout">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

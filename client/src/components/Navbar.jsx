import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Muse Map</span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Calendar</Link>
          {user && (
            <Link to="/my-events" className={`nav-link ${pathname === '/my-events' ? 'active' : ''}`}>
              My Events
            </Link>
          )}
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions desktop-only">
          {user ? (
            <>
              <Link to="/create-event" className="btn btn-primary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Event
              </Link>
              <div className="navbar-user">
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">Sign in</Link>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          <Link to="/" className={`mobile-link ${pathname === '/' ? 'active' : ''}`}>
            Calendar
          </Link>
          {user && (
            <Link to="/my-events" className={`mobile-link ${pathname === '/my-events' ? 'active' : ''}`}>
              My Events
            </Link>
          )}
          {user && (
            <Link to="/create-event" className={`mobile-link ${pathname === '/create-event' ? 'active' : ''}`}>
              + New Event
            </Link>
          )}
        </div>

        <div className="mobile-menu-footer">
          {user ? (
            <>
              <div className="mobile-user">
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <span className="mobile-user-name">{user.name}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

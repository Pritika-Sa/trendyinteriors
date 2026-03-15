import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaYoutube, FaHome, FaBuilding, FaPaintBrush, FaSignOutAlt, FaCrown, FaKey } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;



  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Luxury Logo Section */}
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <div className="logo-wrapper">
              <span className="logo-icon"><FaHome /></span>
              <span className="logo-text">
                Trendy <span className="logo-accent">Interios</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/abouts"
            className={`nav-link ${isActive('/abouts') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            About Us
          </Link>

          {/* Enhanced Project Dropdown */}
          <div
            className={`dropdown ${activeDropdown === 'project' ? 'open' : ''}`}
            onMouseEnter={() => window.innerWidth > 992 && setActiveDropdown('project')}
            onMouseLeave={() => window.innerWidth > 992 && setActiveDropdown(null)}
          >
            <button
              className={`nav-link dropdown-toggle ${location.pathname.includes('/projects') ? 'active' : ''}`}
              onClick={() => toggleDropdown('project')}
            >
              Project
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu wide-menu ${activeDropdown === 'project' ? 'active' : ''}`}>
              <Link to="/projects?type=commercial" className="dropdown-item" onClick={closeMenu}>
                <div className="menu-icon"><FaBuilding /></div>
                <div className="menu-content">
                  <span className="menu-title">Commercial</span>
                  <span className="menu-desc">Office & Retail Spaces</span>
                </div>
              </Link>
              <Link to="/projects?type=residential" className="dropdown-item" onClick={closeMenu}>
                <div className="menu-icon"><FaHome /></div>
                <div className="menu-content">
                  <span className="menu-title">Residential</span>
                  <span className="menu-desc">Luxury Homes & Villas</span>
                </div>
              </Link>
              <Link to="/projects?type=art-craft" className="dropdown-item" onClick={closeMenu}>
                <div className="menu-icon"><FaPaintBrush /></div>
                <div className="menu-content">
                  <span className="menu-title">Art & Craft</span>
                  <span className="menu-desc">Handmade Decor Items</span>
                </div>
              </Link>
            </div>
          </div>

          <Link
            to="/testimonials"
            className={`nav-link ${isActive('/testimonials') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Testimonial
          </Link>
          <Link
            to="/reachus"
            className={`nav-link ${isActive('/reachus') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Reach Us
          </Link>
          <Link
            to="/give-testimonial"
            className={`nav-link ${isActive('/give-testimonial') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Give Testimonial
          </Link>

          {/* Mobile Only: Auth Links */}
          <div className="mobile-auth-links">
            {user && user.role === 'admin' ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-avatar">
                    <FaCrown />
                  </div>
                  <span>Admin</span>
                </div>
                <Link to="/admin" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <button 
                  className="nav-link" 
                  onClick={() => setIsPasswordModalOpen(true)}
                  style={{ textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem' }}
                >
                  Change Password
                </button>
                <button className="nav-link" onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem' }}>
                  Logout
                </button>
              </>
            ) : (
              /* Admin Login Only */
              <Link to="/login" className="nav-link" onClick={closeMenu}>Admin Login</Link>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* YouTube Icon */}
          <a
            href="https://www.youtube.com/@TrendyInterioS-ql7rz"
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-icon-wrapper"
            data-tooltip="Watch Our Works"
          >
            <div className="youtube-icon">
              <FaYoutube />
            </div>
          </a>

          {/* Admin / Auth Section */}
          <div className="auth-action">
            {user && user.role === 'admin' ? (
              <div
                className={`dropdown profile-dropdown-wrapper ${activeDropdown === 'profile' ? 'open' : ''}`}
                onMouseEnter={() => window.innerWidth > 992 && setActiveDropdown('profile')}
                onMouseLeave={() => window.innerWidth > 992 && setActiveDropdown(null)}
              >
                <button
                  className="profile-button"
                  onClick={() => toggleDropdown('profile')}
                >
                  <div className="profile-avatar">
                    <FaCrown />
                  </div>
                </button>

                <div className={`dropdown-menu ${activeDropdown === 'profile' ? 'active' : ''} profile-menu`}>
                  <div className="profile-dropdown-header">
                    <span className="profile-dropdown-name">Admin</span>
                  </div>
                  <Link to="/admin" className="profile-dropdown-item" onClick={closeMenu}>
                    <FaCrown /> Dashboard
                  </Link>
                  <button 
                    className="profile-dropdown-item" 
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      setActiveDropdown(null);
                    }}
                  >
                    <FaKey /> Change Password
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setActiveDropdown(null);
        }}
      />
    </header>
  );
};

export default Header;

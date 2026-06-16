import React, { useState, useEffect } from 'react';
import { Menu, Search, Calendar } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentPath }) => {
  const [query, setQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    localStorage.setItem('globalSearchQuery', val);
    window.dispatchEvent(new CustomEvent('globalSearch', { detail: { query: val } }));
  };

  const getPlaceholder = () => {
    if (currentPath === 'accounts') {
      return 'Search accounts...';
    }
    if (currentPath === 'contacts') {
      return 'Search contacts...';
    }
    if (currentPath === 'leads') {
      return 'Search leads...';
    }
    if (currentPath === 'deals') {
      return 'Search deals...';
    }
    return 'Search leads, deals, or tasks...';
  };

  const getBreadcrumbs = () => {
    if (!currentPath) return null;
    
    let label = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
    if (currentPath === 'dashboard') {
      label = 'Overview';
    }
    
    return (
      <div className="header-breadcrumbs">
        <span className="breadcrumb-root">Dashboard</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{label}</span>
      </div>
    );
  };

  return (
    <header className="main-header">
      <div className="header-top">
        {/* Left side: Menu toggle, mobile logo, breadcrumbs */}
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Open menu" style={{ zIndex: 10, flexShrink: 0 }}>
            <Menu size={22} />
          </button>
          
          {/* Mobile Logo */}
          <div className="mobile-logo-container">
            <img src="/nobg-logo.png" alt="KES Logo" className="mobile-logo" />
          </div>

          {/* Desktop Breadcrumbs */}
          <div className="desktop-breadcrumbs">
            {getBreadcrumbs()}
          </div>
        </div>

        {/* Center: Search container */}
        <div className="header-center">
          <div className="search-container" style={{ margin: 0, width: '100%', maxWidth: '440px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={getPlaceholder()} 
              value={query}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Right side: Date */}
        <div className="header-right">
          <div className="header-date-badge">
            <Calendar size={15} />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

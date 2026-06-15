import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentPath }) => {
  const [query, setQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');

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

  return (
    <header className="main-header">
      <div className="header-top" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px' }}>
        <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Open menu" style={{ zIndex: 10, flexShrink: 0 }}>
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: 0 }}>
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
        <div className="menu-toggle-spacer" style={{ width: '38px', flexShrink: 0 }} />
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Search, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="main-header">
      <div className="header-top">
        <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search leads, deals, or tasks..." />
          <div className="search-shortcut">⌘K</div>
        </div>


      </div>

    </header>
  );
};

export default Header;

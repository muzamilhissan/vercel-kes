import React from 'react';
import { Search } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-top">
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

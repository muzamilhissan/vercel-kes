import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPath, onNavigate }) => {
  return (
    <div className="main-layout">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <div className="content-wrapper">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

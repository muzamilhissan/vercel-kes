import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  Contact,
  Building,
  X
} from 'lucide-react';
import './Sidebar.css';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={() => onClick(path)}>
    <div className="nav-item-content">
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
  </div>
);

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isOpen, onClose }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const fullName = user?.name || user?.fullName || 'Jane Sparrow';
  const designation = user?.roles?.[0]?.name || user?.designation || 'Sales Executive';
  const avatarUrl = userStr
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=70309f&color=fff&bold=true`
    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop";



  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
        <X size={20} />
      </button>
      <div className="sidebar-brand">
        <img src="/nobg-logo.png" alt="KES Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-profile">
        <div className="avatar-wrapper">
          <div className="status-ring"></div>
          <div className="profile-avatar">
            <img src={avatarUrl} alt={fullName} />
          </div>
        </div>
        <div className="profile-info">
          <h3>{fullName}</h3>
          <p>{designation}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="section-title">MENU</p>
          {/* <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Kanban View" 
            path="dashboard"
            active={currentPath === 'dashboard'} 
            onClick={onNavigate}
          /> */}
          <NavItem 
            icon={<Users size={20} />} 
            label="Leads" 
            path="leads"
            active={currentPath === 'leads'} 
            onClick={onNavigate}
          />
          <NavItem 
            icon={<Briefcase size={20} />} 
            label="Deals" 
            path="deals"
            active={currentPath === 'deals'} 
            onClick={onNavigate}
          />
          <NavItem 
            icon={<Contact size={20} />} 
            label="Contacts" 
            path="contacts"
            active={currentPath === 'contacts'} 
            onClick={onNavigate}
          />
          <NavItem 
            icon={<Building size={20} />} 
            label="Accounts" 
            path="accounts"
            active={currentPath === 'accounts'} 
            onClick={onNavigate}
          />
          {/* <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Reporting" 
            path="reporting"
            active={currentPath === 'reporting'} 
            onClick={onNavigate}
          /> */}
        </div>
      </nav>

      <div className="sidebar-footer">
        {/* <NavItem icon={<Settings size={20} />} label="Configurations" path="settings" onClick={onNavigate} /> */}
        <NavItem icon={<LogOut size={20} />} label="Sign Out" path="logout" onClick={onNavigate} />
      </div>
    </aside>
  );
};

export default Sidebar;

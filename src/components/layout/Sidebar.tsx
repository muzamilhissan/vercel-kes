import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  Contact,
  Building2
} from 'lucide-react';
import './Sidebar.css';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  count?: number;
  active?: boolean;
  onClick: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, count, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={() => onClick(path)}>
    <div className="nav-item-content">
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
    {count !== undefined && <span className="nav-count">{count}</span>}
  </div>
);

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="avatar-wrapper">
          <div className="status-ring"></div>
          <div className="profile-avatar">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Jane Sparrow" />
          </div>
        </div>
        <div className="profile-info">
          <h3>Jane Sparrow</h3>
          <p>Sales Executive</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="section-title">DASHBOARDS</p>
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
            count={12} 
            active={currentPath === 'leads'} 
            onClick={onNavigate}
          />
          {/* <NavItem 
            icon={<Contact size={20} />} 
            label="Contacts" 
            path="contacts"
            active={currentPath === 'contacts'} 
            onClick={onNavigate}
          /> */}
          {/* <NavItem 
            icon={<Building2 size={20} />} 
            label="Accounts" 
            path="accounts"
            active={currentPath === 'accounts'} 
            onClick={onNavigate}
          /> */}
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
        <NavItem icon={<LogOut size={20} />} label="Logout" path="logout" onClick={onNavigate} />
      </div>
    </aside>
  );
};

export default Sidebar;

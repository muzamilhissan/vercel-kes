import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  Contact,
  Building2,
  X
} from 'lucide-react';
import './Sidebar.css';
import { leadService } from '../../api/leadService';
import { dealService } from '../../api/dealService';
import { accountService } from '../../api/accountService';

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

  const [leadsCount, setLeadsCount] = useState<number | undefined>(undefined);
  const [dealsCount, setDealsCount] = useState<number | undefined>(undefined);
  const [accountsCount, setAccountsCount] = useState<number | undefined>(undefined);

  const fetchCount = async () => {
    try {
      const res = await leadService.list() as any;
      if (res.success) {
        const apiLeads = res.leads || res.data?.leads || res.data;
        if (Array.isArray(apiLeads)) {
          setLeadsCount(apiLeads.length);
        }
      }
    } catch (err) {
      console.error('Error fetching leads count in sidebar:', err);
    }
  };

  const fetchDealsCount = async () => {
    try {
      const res = await dealService.list();
      if (res.success && Array.isArray(res.data)) {
        setDealsCount(res.data.length);
      }
    } catch (err) {
      console.error('Error fetching deals count in sidebar:', err);
    }
  };

  const fetchAccountsCount = async () => {
    try {
      const res = await accountService.list() as any;
      if (res.success) {
        const apiAccounts = res.accounts || res.data?.accounts || res.data;
        if (Array.isArray(apiAccounts)) {
          setAccountsCount(apiAccounts.length);
        }
      }
    } catch (err) {
      console.error('Error fetching accounts count in sidebar:', err);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchDealsCount();
    fetchAccountsCount();

    const handleLeadsUpdate = () => {
      fetchCount();
    };

    const handleDealsUpdate = () => {
      fetchDealsCount();
    };

    const handleAccountsUpdate = () => {
      fetchAccountsCount();
    };

    window.addEventListener('leadsUpdated', handleLeadsUpdate);
    window.addEventListener('dealsUpdated', handleDealsUpdate);
    window.addEventListener('accountsUpdated', handleAccountsUpdate);
    return () => {
      window.removeEventListener('leadsUpdated', handleLeadsUpdate);
      window.removeEventListener('dealsUpdated', handleDealsUpdate);
      window.removeEventListener('accountsUpdated', handleAccountsUpdate);
    };
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
        <X size={20} />
      </button>
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
            count={leadsCount} 
            active={currentPath === 'leads'} 
            onClick={onNavigate}
          />
          {/* <NavItem 
            icon={<Briefcase size={20} />} 
            label="Deals" 
            path="deals"
            count={dealsCount} 
            active={currentPath === 'deals'} 
            onClick={onNavigate}
          /> */}
          {/* <NavItem 
            icon={<Contact size={20} />} 
            label="Contacts" 
            path="contacts"
            active={currentPath === 'contacts'} 
            onClick={onNavigate}
          /> */}
          <NavItem 
            icon={<Building2 size={20} />} 
            label="Accounts" 
            path="accounts"
            count={accountsCount}
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
        <NavItem icon={<LogOut size={20} />} label="Logout" path="logout" onClick={onNavigate} />
      </div>
    </aside>
  );
};

export default Sidebar;

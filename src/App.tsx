import React, { useState, useEffect } from 'react'
import SignIn from './SignIn'
import Dashboard from './pages/Dashboard'
import LeadsPage from './pages/LeadsPage'
import DealsPage from './pages/DealsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactsPage from './pages/ContactsPage'
import AccountsPage from './pages/AccountsPage'
import CompanyDocumentsPage from './pages/CompanyDocumentsPage'
import SSOLogin from './pages/SSOLogin'
import MainLayout from './components/layout/MainLayout'
import { authService } from './api/authService'
import LogoutModal from './components/layout/LogoutModal'
import Loader from './components/ui/Loader'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPath, setCurrentPath] = useState(() => localStorage.getItem('currentPath') || 'leads');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [isSSO, setIsSSO] = useState(() => {
    // Check if URL has SSO token
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('token');
  });

  useEffect(() => {
    document.title = isAuthenticated ? 'KudonCRM' : 'Login';
  }, [isAuthenticated]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      const response = await authService.login({ email, password: pass }) as any;
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;
      
      if (token) {
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        setIsWorkspaceLoading(true);
        setIsAuthenticated(true);
        
        // Simulate global workspace initialization
        setTimeout(() => {
          setIsWorkspaceLoading(false);
        }, 1500);
      } else {
        throw new Error('Login succeeded but no token was returned.');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleSSOLogin = () => {
    setIsAuthenticated(true);
    setIsSSO(false);
    setCurrentPath('leads');
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentPath');
      setIsAuthenticated(false);
      setCurrentPath('leads');
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const handleNavigate = async (path: string) => {
    if (path === 'logout') {
      setIsLogoutModalOpen(true);
    } else {
      setCurrentPath(path);
      localStorage.setItem('currentPath', path);
      window.dispatchEvent(new CustomEvent('sidebarNavigate', { detail: { path } }));
    }
  };

  const renderPage = () => {
    switch (currentPath) {
      case 'dashboard':
      case 'pipeline':
        return <Dashboard currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'leads':
        return <LeadsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'deals':
        return <DealsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'contacts':
        return <ContactsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'accounts':
        return <AccountsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'documents':
        return <CompanyDocumentsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'reporting':
        return <AnalyticsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      default:
        return <Dashboard currentPath={currentPath} onNavigate={handleNavigate} />;
    }
  };

  // Handle SSO login flow
  if (isSSO && !isAuthenticated) {
    return <SSOLogin onLogin={handleSSOLogin} />;
  }

  if (isWorkspaceLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', zIndex: 9999 }}>
        <Loader message="Preparing your workspace..." height="auto" showLogo={true} />
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? renderPage() : <SignIn onLogin={handleLogin} />}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} 
        onConfirm={handleLogoutConfirm} 
        isLoggingOut={isLoggingOut}
      />
    </div>
  )
}

export default App

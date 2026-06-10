import React, { useState } from 'react'
import SignIn from './SignIn'
import Dashboard from './pages/Dashboard'
import LeadsPage from './pages/LeadsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactsPage from './pages/ContactsPage'
import AccountsPage from './pages/AccountsPage'
import MainLayout from './components/layout/MainLayout'
import { authService } from './api/authService'
import LogoutModal from './components/layout/LogoutModal'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPath, setCurrentPath] = useState('leads');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
        setIsAuthenticated(true);
      } else {
        throw new Error('Login succeeded but no token was returned.');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentPath('leads');
    }
  };

  const handleNavigate = async (path: string) => {
    if (path === 'logout') {
      setIsLogoutModalOpen(true);
    } else {
      setCurrentPath(path);
    }
  };

  const renderPage = () => {
    switch (currentPath) {
      case 'dashboard':
      case 'pipeline':
        return <Dashboard currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'leads':
        return <LeadsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'contacts':
        return <ContactsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'accounts':
        return <AccountsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      case 'reporting':
        return <AnalyticsPage currentPath={currentPath} onNavigate={handleNavigate} />;
      default:
        return <Dashboard currentPath={currentPath} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {isAuthenticated ? renderPage() : <SignIn onLogin={handleLogin} />}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogoutConfirm} 
      />
    </div>
  )
}

export default App

import React, { useState } from 'react'
import SignIn from './SignIn'
import Dashboard from './pages/Dashboard'
import LeadsPage from './pages/LeadsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactsPage from './pages/ContactsPage'
import AccountsPage from './pages/AccountsPage'
import MainLayout from './components/layout/MainLayout'
import { authService } from './api/authService'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPath, setCurrentPath] = useState('leads');

  const handleLogin = async (email: string, pass: string) => {
    try {
      const response = await authService.login({ email, password: pass });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
      } else {
        alert('Login succeeded but no token was returned.');
      }
    } catch (error: any) {
      alert(`Login failed: ${error.message || error}`);
    }
  };

  const handleNavigate = async (path: string) => {
    if (path === 'logout') {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout API failed:', error);
      } finally {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentPath('leads');
      }
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
    </div>
  )
}

export default App

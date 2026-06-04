import React, { useState } from 'react'
import SignIn from './SignIn'
import Dashboard from './pages/Dashboard'
import LeadsPage from './pages/LeadsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactsPage from './pages/ContactsPage'
import AccountsPage from './pages/AccountsPage'
import MainLayout from './components/layout/MainLayout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState('leads');

  // Demo credentials: admin@kudon.com / admin123
  const handleLogin = (email: string, pass: string) => {
    if (email === 'admin@kudon.com' && pass === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid demo credentials. Use admin@kudon.com / admin123');
    }
  };

  const handleNavigate = (path: string) => {
    if (path === 'logout') {
      setIsAuthenticated(false);
      setCurrentPath('leads');
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

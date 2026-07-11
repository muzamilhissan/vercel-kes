import React, { useEffect, useState } from 'react';
import { authService } from '../api/authService';
import '../SignIn.css';

interface SSOLoginProps {
  onLogin: () => void;
}

const SSOLogin: React.FC<SSOLoginProps> = ({ onLogin }) => {
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const performSSOLogin = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const switchToken = urlParams.get('token');

        if (!switchToken) {
          setError('No authentication token provided.');
          setIsProcessing(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        // Exchange switch token for CRM session
        const response = await authService.loginWithSwitchToken(switchToken) as any;
        const token = response.token || response.data?.token;
        const user = response.user || response.data?.user;

        if (token) {
          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          // Clear the token from URL
          window.history.replaceState({}, document.title, '/');
          
          // Call the onLogin callback to update App state
          onLogin();
        } else {
          throw new Error('Authentication succeeded but no token was returned.');
        }
      } catch (error: any) {
        console.error('SSO Login Error:', error);
        setError(error.message || 'Authentication failed. Please try again.');
        setIsProcessing(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    performSSOLogin();
  }, [onLogin]);

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/nobg-logo.png" 
            alt="KudonCRM Logo" 
            style={{ width: '120px', marginBottom: '20px' }}
          />
          
          {isProcessing ? (
            <>
              <h2 style={{ marginBottom: '10px', color: '#333' }}>Logging you in...</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Please wait while we authenticate your session.
              </p>
              <div className="spinner" style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: '10px', color: '#e74c3c' }}>Authentication Failed</h2>
              <p style={{ 
                color: '#e74c3c', 
                background: '#fadbd8', 
                padding: '15px', 
                borderRadius: '5px',
                marginTop: '20px'
              }}>
                {error}
              </p>
              <p style={{ color: '#666', marginTop: '15px' }}>
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SSOLogin;
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import './SignIn.css';

interface SignInProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

const SignIn: React.FC<SignInProps> = ({ onLogin }) => {
  const bgImage = '/bg-image.webp';
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="signin-card">
        {/* Left Side: Visual & Quote */}
        <div className="signin-visual" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="visual-footer">
              <h1 className="visual-title">KUDON<br />ENGINEERING<br />SERVICES</h1>
              <p className="visual-desc">
                Engineering Excellence
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="signin-form-container">
          <div className="form-header">
            <div className="logo-container">
              <img src="/nobg-logo.png" alt="Logo" className="form-logo" />
            </div>
          </div>

          <div className="form-body">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Enter your email and password to access your account</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Enter your password" 
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>


              <button type="submit" className="btn-signin" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

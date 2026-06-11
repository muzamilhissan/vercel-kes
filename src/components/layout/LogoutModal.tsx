import React from 'react';
import { LogOut, X } from 'lucide-react';
import '../../Modals.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isLoggingOut ? undefined : onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        {isLoggingOut ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #f5f0fa', borderTop: '4px solid #70309f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '16px', fontFamily: "'Inter', sans-serif", margin: 0 }}>Logging you out securely...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #fcfafc, #f5f0fa)', borderBottom: '1px solid #ede4f5', padding: '20px 32px' }}>
              <h3 style={{ color: '#70309f', fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Log Out</h3>
              <button onClick={onClose} style={{ background: '#fff', borderColor: '#ede4f5', color: '#70309f', width: '32px', height: '32px', borderRadius: '10px' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '24px 32px' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#f5f0fa', color: '#70309f', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <LogOut size={24} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>Confirm Sign Out</h4>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>Are you sure you want to log out of KudonCRM? You will need to log in again to access your account.</p>
              <div className="modal-footer" style={{ padding: '24px 0 0', justifyContent: 'center', gap: '12px', width: '100%' }}>
                <button onClick={onClose} className="btn-premium-secondary" style={{ flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }}>Cancel</button>
                <button onClick={onConfirm} className="btn-premium-primary" style={{ background: 'linear-gradient(135deg, #70309f 0%, #5b2484 100%)', flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }}>Log Out</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutModal;

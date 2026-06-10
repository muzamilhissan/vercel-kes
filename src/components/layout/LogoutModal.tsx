import React from 'react';
import { LogOut, X } from 'lucide-react';
import '../../Modals.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #fcfafc, #f5f0fa)', borderBottom: '1px solid #ede4f5' }}>
          <h3 style={{ color: '#70309f', fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700 }}>Log Out</h3>
          <button onClick={onClose} style={{ background: '#fff', borderColor: '#ede4f5', color: '#70309f' }}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#f5f0fa', color: '#70309f', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <LogOut size={32} />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>Confirm Sign Out</h4>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>Are you sure you want to log out of KudonCRM? You will need to log in again to access your account.</p>
          <div className="modal-footer" style={{ padding: '32px 0 0', justifyContent: 'center', gap: '12px', width: '100%' }}>
            <button onClick={onClose} className="btn-premium-secondary" style={{ flex: 1, margin: 0 }}>Cancel</button>
            <button onClick={onConfirm} className="btn-premium-primary" style={{ background: 'linear-gradient(135deg, #70309f 0%, #5b2484 100%)', flex: 1, margin: 0 }}>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

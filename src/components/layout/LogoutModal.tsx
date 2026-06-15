import React from 'react';
import { LogOut, X } from 'lucide-react';
import './LogoutModal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content logout-modal-compact" onClick={e => e.stopPropagation()}>
        {isLoggingOut ? (
          <div className="logout-body loading">
            <div className="logout-spinner"></div>
            <p className="logout-loading-text">Logging you out securely...</p>
          </div>
        ) : (
          <>
            <button className="logout-close-btn" onClick={onClose}>
              <X size={16} />
            </button>
            <div className="logout-body">
              <div className="logout-icon-box">
                <LogOut size={22} />
              </div>
              <h4 className="logout-title">Confirm Sign Out</h4>
              <p className="logout-desc">
                Are you sure you want to log out of KudonCRM?
              </p>
              <div className="logout-footer-actions">
                <button onClick={onClose} className="btn-premium-secondary compact-btn">
                  Cancel
                </button>
                <button onClick={onConfirm} className="btn-premium-primary compact-btn logout-btn">
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutModal;

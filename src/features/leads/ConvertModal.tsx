import React from 'react';
import { UserPlus, X, CheckCircle } from 'lucide-react';
import './ConvertModal.css';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  isConverting?: boolean;
}

const ConvertModal: React.FC<ConvertModalProps> = ({ isOpen, onClose, onConfirm, leadName, isConverting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="convert-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} disabled={isConverting}><X size={20} /></button>
        
        <div className="success-icon">
          <UserPlus size={28} />
        </div>
        
        <div className="convert-header">
          <h3>Elevate to Contact</h3>
          <p>You are converting <strong>{leadName}</strong> into a permanent record.</p>
        </div>

        <div className="convert-features">
          {['Create Account record', 'Link to active deals', 'Transfer logs'].map(item => (
            <div key={item} className="feature">
              <CheckCircle size={16} /> <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="convert-footer">
          <button onClick={onClose} className="btn-premium-secondary" disabled={isConverting}>Cancel</button>
          <button onClick={onConfirm} className="btn-premium-primary" disabled={isConverting}>
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertModal;

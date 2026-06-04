import React from 'react';
import { UserPlus, X, CheckCircle } from 'lucide-react';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
}

const ConvertModal: React.FC<ConvertModalProps> = ({ isOpen, onClose, onConfirm, leadName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)', borderBottom: '1px solid #bbf7d0' }}>
          <h3 style={{ color: '#166534' }}>Convert Lead</h3>
          <button onClick={onClose} style={{ background: '#fff', borderColor: '#bbf7d0', color: '#10b981' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', color: '#10b981', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <UserPlus size={32} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Elevate to Contact</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>You are converting <strong>{leadName}</strong> into a permanent record.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '20px', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
            {['Create Account record', 'Link to active deals', 'Transfer logs'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                <CheckCircle size={16} color="#10b981" /> {item}
              </div>
            ))}
          </div>
          <div className="modal-footer" style={{ padding: '32px 0 0' }}>
            <button onClick={onClose} className="btn-premium-secondary">Not Now</button>
            <button onClick={onConfirm} className="btn-premium-primary" style={{ background: '#10b981', boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.3)' }}>Complete Conversion</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertModal;

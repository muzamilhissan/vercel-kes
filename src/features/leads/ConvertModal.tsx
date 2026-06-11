import React from 'react';
import { UserPlus, X, CheckCircle } from 'lucide-react';

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
    <div className="modal-overlay" onClick={isConverting ? undefined : onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)', borderBottom: '1px solid #bbf7d0', padding: '20px 32px' }}>
          <h3 style={{ color: '#166534', fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Convert Lead</h3>
          <button onClick={onClose} disabled={isConverting} style={{ background: '#fff', borderColor: '#bbf7d0', color: '#10b981', width: '32px', height: '32px', borderRadius: '10px' }}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ padding: '24px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '52px', height: '52px', backgroundColor: '#dcfce7', color: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UserPlus size={24} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>Elevate to Contact</h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', margin: 0 }}>You are converting <strong>{leadName}</strong> into a permanent record.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '16px 20px', border: '1px solid #f1f5f9', borderRadius: '14px' }}>
            {['Create Account record', 'Link to active deals', 'Transfer logs'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                <CheckCircle size={16} color="#10b981" /> {item}
              </div>
            ))}
          </div>
          <div className="modal-footer" style={{ padding: '24px 0 0', justifyContent: 'center', gap: '12px', width: '100%' }}>
            <button onClick={onClose} className="btn-premium-secondary" style={{ flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }} disabled={isConverting}>Not Now</button>
            <button onClick={onConfirm} className="btn-premium-primary" style={{ background: '#10b981', boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.3)', flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }} disabled={isConverting}>
              {isConverting ? 'Converting...' : 'Complete Conversion'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertModal;

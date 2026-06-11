import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isDeleting ? undefined : onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #fff5f5, #fee2e2)', borderBottom: '1px solid #fecaca', padding: '20px 32px' }}>
          <h3 style={{ color: '#991b1b', fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Delete Record</h3>
          <button onClick={onClose} disabled={isDeleting} style={{ background: '#fff', borderColor: '#fecaca', color: '#dc2626', width: '32px', height: '32px', borderRadius: '10px' }}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '24px 32px' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertCircle size={24} />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>Confirm Deletion</h4>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>Are you sure you want to delete <strong>{itemName}</strong>? This action is permanent.</p>
          <div className="modal-footer" style={{ padding: '24px 0 0', justifyContent: 'center', gap: '12px', width: '100%' }}>
            <button onClick={onClose} className="btn-premium-secondary" style={{ flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }} disabled={isDeleting}>Cancel</button>
            <button onClick={onConfirm} className="btn-premium-primary" style={{ background: '#ef4444', boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.3)', flex: 1, margin: 0, padding: '12px 24px', borderRadius: '12px', fontSize: '14px' }} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #fff5f5, #fee2e2)', borderBottom: '1px solid #fecaca' }}>
          <h3 style={{ color: '#991b1b' }}>Delete Record</h3>
          <button onClick={onClose} style={{ background: '#fff', borderColor: '#fecaca', color: '#dc2626' }}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <AlertCircle size={32} />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Confirm Deletion</h4>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>Are you sure you want to delete <strong>{itemName}</strong>? This action is permanent.</p>
          <div className="modal-footer" style={{ padding: '32px 0 0', justifyContent: 'center' }}>
            <button onClick={onClose} className="btn-premium-secondary" style={{ flex: 1 }}>Cancel</button>
            <button onClick={onConfirm} className="btn-premium-primary" style={{ background: '#ef4444', boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.3)', flex: 1 }}>Delete Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

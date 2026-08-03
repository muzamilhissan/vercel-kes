import React from 'react';
import { AlertCircle, X, Trash2 } from 'lucide-react';
import './DeleteModal.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isDeleting?: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  iconType?: 'alert' | 'trash';
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName, isDeleting, title, message, confirmText, iconType = 'alert' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal-compact" onClick={e => e.stopPropagation()}>
        <button className="delete-close-btn" onClick={onClose} disabled={isDeleting}>
          <X size={16} />
        </button>
        <div className="delete-body">
          <div className="delete-warning-icon">
            {iconType === 'trash' ? <Trash2 size={22} /> : <AlertCircle size={22} />}
          </div>
          <h4 className="delete-title">{title || 'Confirm Deletion'}</h4>
          <div className="delete-desc">
            {message || (
              <>Are you sure you want to delete {itemName ? <strong style={{ color: '#1e293b' }}>"{itemName}"</strong> : 'this item'}?</>
            )}
          </div>
          <div className="delete-footer-actions">
            <button onClick={onClose} className="btn-premium-secondary compact-btn" disabled={isDeleting}>
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-premium-primary compact-btn delete-btn" disabled={isDeleting}>
              {isDeleting ? 'Processing...' : (confirmText || 'Delete Now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

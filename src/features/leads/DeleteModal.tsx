import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './DeleteModal.css';

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
    <div className="modal-overlay">
      <div className="modal-content delete-modal-compact" onClick={e => e.stopPropagation()}>
        <button className="delete-close-btn" onClick={onClose} disabled={isDeleting}>
          <X size={16} />
        </button>
        <div className="delete-body">
          <div className="delete-warning-icon">
            <AlertCircle size={22} />
          </div>
          <h4 className="delete-title">Confirm Deletion</h4>
          <p className="delete-desc">
            Are you sure you want to delete?
          </p>
          <div className="delete-footer-actions">
            <button onClick={onClose} className="btn-premium-secondary compact-btn" disabled={isDeleting}>
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-premium-primary compact-btn delete-btn" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

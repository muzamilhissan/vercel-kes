import React from 'react';
import { X } from 'lucide-react';
import { FrontendDeal } from './DealTable';
import DealAttachments from './DealAttachments';
import '../leads/LeadModal.css';

interface DealAttachmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: FrontendDeal | null;
}

const DealAttachmentsModal: React.FC<DealAttachmentsModalProps> = ({ isOpen, onClose, deal }) => {
  if (!isOpen || !deal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Attachments Manager</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '10px' }}><X size={20} /></button>
        </div>
        
        <div className="modal-body" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          padding: '24px 32px 20px',
          maxHeight: 'calc(80vh - 120px)',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deal</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>{deal.name}</span>
          </div>

          <DealAttachments dealId={deal.id} />
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '16px 32px 20px', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
          <button onClick={onClose} className="btn-premium-primary" style={{ padding: '8px 20px', borderRadius: '10px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealAttachmentsModal;

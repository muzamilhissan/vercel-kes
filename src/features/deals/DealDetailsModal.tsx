import React from 'react';
import { X } from 'lucide-react';
import { FrontendDeal } from './DealTable';
import '../leads/LeadModal.css';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: FrontendDeal | null;
  onAccountClick: (accountId: string) => void;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ isOpen, onClose, deal, onAccountClick }) => {
  if (!isOpen || !deal) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStageClass = (stage: string) => {
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('won') || stageLower.includes('done')) return 'status-qualified';
    if (stageLower.includes('progress') || stageLower.includes('process')) return 'status-contacted';
    if (stageLower.includes('new') || stageLower.includes('to do')) return 'status-new';
    return 'status-converted';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 700 }}>Deal Details</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '10px' }}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 32px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deal Name</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{deal.name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{formatCurrency(deal.value)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Account</span>
              <span 
                onClick={() => {
                  onClose();
                  if (deal.accountId) onAccountClick(deal.accountId);
                }}
                style={{ 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  color: '#70309f', 
                  cursor: 'pointer' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {deal.accountName}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Close Date</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{deal.closeDate}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</span>
              <div style={{ marginTop: '2px' }}>
                <span className={`status-badge ${getStageClass(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '0px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</span>
            <span style={{ 
              fontSize: '14px', 
              color: deal.notes ? '#334155' : '#94a3b8', 
              background: '#f8fafc', 
              padding: '10px 14px', 
              borderRadius: '10px', 
              border: '1.5px solid #e2e8f0',
              whiteSpace: 'pre-wrap',
              minHeight: '50px'
            }}>
              {deal.notes || 'No notes added for this deal.'}
            </span>
          </div>
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

export default DealDetailsModal;

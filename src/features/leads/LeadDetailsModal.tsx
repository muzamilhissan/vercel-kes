import React from 'react';
import { X } from 'lucide-react';
import { Lead } from './LeadTable';
import './LeadModal.css';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact">
        <div className="modal-header">
          <h3>Lead Details</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px 32px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{lead.name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{lead.company}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', wordBreak: 'break-all' }}>{lead.email}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{lead.phone}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
              <div style={{ marginTop: '2px' }}>
                <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                  {lead.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Added</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{lead.dateAdded || '-'}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
          <button onClick={onClose} className="btn-premium-primary" style={{ padding: '10px 24px', borderRadius: '10px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;

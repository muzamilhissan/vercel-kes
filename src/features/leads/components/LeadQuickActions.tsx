import React, { useState } from 'react';
import { Loader2, Zap, Phone, Check, Edit, XOctagon, Trash2, Send, RotateCcw } from 'lucide-react';
import { Lead } from '../LeadTable';

interface LeadQuickActionsProps {
  lead: Lead;
  onContactClick: () => void;
  onSendProposalClick: () => void;
  onReproposeClick?: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onStatusUpdate: (status: string) => Promise<void>;
}

const LeadQuickActions: React.FC<LeadQuickActionsProps> = ({ 
  lead, 
  onContactClick, 
  onSendProposalClick, 
  onReproposeClick,
  onEditClick, 
  onDeleteClick,
  onStatusUpdate 
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusClick = async (status: string) => {
    if (updatingStatus) return;
    setUpdatingStatus(status);
    try {
      await onStatusUpdate(status);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="lead-details-card">
      <div className="card-header">
        <Zap size={16} className="header-icon" />
        <h3>Quick Actions</h3>
      </div>
      <div className="card-body actions-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lead.status === 'Proposed' && onReproposeClick ? (
          <button className="quick-action-btn primary" onClick={onReproposeClick}>
            <RotateCcw size={16} /> Re-propose
          </button>
        ) : lead.status === 'Contacted' ? (
          <button className="quick-action-btn primary" onClick={onSendProposalClick}>
            <Send size={16} /> Send Proposal
          </button>
        ) : (
          <div title={['Proposed', 'Qualified', 'Disqualified', 'Converted'].includes(lead.status) ? 'Lead is already contacted' : undefined} style={{ display: 'inline-block', width: '100%' }}>
            <button 
              className="quick-action-btn primary" 
              onClick={onContactClick}
              disabled={['Proposed', 'Qualified', 'Disqualified', 'Converted'].includes(lead.status)}
              style={{
                opacity: ['Proposed', 'Qualified', 'Disqualified', 'Converted'].includes(lead.status) ? 0.6 : 1,
                pointerEvents: ['Proposed', 'Qualified', 'Disqualified', 'Converted'].includes(lead.status) ? 'none' : 'auto',
                width: '100%'
              }}
            >
              <Phone size={16} /> {['Proposed', 'Qualified', 'Disqualified', 'Converted'].includes(lead.status) ? 'Lead Contacted' : 'Contact Lead'}
            </button>
          </div>
        )}
        
        {lead.status === 'New' && (
          <button className="quick-action-btn outline" disabled={!!updatingStatus} onClick={() => handleStatusClick('Contacted')} style={updatingStatus ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {updatingStatus === 'Contacted' ? <Loader2 size={16} className="lucide-spin" /> : <Check size={16} />} Mark as Contacted
          </button>
        )}
        {lead.status === 'Contacted' && (
          <button className="quick-action-btn outline" disabled={!!updatingStatus} onClick={() => handleStatusClick('Proposed')} style={updatingStatus ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {updatingStatus === 'Proposed' ? <Loader2 size={16} className="lucide-spin" /> : <Check size={16} />} Mark as Proposed
          </button>
        )}
        {lead.status === 'Proposed' && (
          <button className="quick-action-btn outline" disabled={!!updatingStatus} onClick={() => handleStatusClick('Qualified')} style={updatingStatus ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {updatingStatus === 'Qualified' ? <Loader2 size={16} className="lucide-spin" /> : <Check size={16} />} Mark as Qualified
          </button>
        )}
        {(lead.status === 'Qualified' || lead.status === 'Disqualified' || lead.status === 'Converted') && (
          <button className="quick-action-btn outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <Check size={16} /> Closed Lead
          </button>
        )}

        <button className="quick-action-btn outline" onClick={onEditClick}>
          <Edit size={16} /> Edit Lead
        </button>

        {lead.status !== 'Disqualified' && lead.status !== 'Qualified' && lead.status !== 'Converted' ? (
          <button className="quick-action-btn danger-outline" disabled={!!updatingStatus} onClick={() => handleStatusClick('Disqualified')} style={updatingStatus ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
            {updatingStatus === 'Disqualified' ? <Loader2 size={16} className="lucide-spin" /> : <XOctagon size={16} />} Mark as Disqualified
          </button>
        ) : (
          <button className="quick-action-btn danger-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <XOctagon size={16} /> {lead.status === 'Disqualified' ? 'Lead is Disqualified' : 'Lead is Closed'}
          </button>
        )}
        
        <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
        
        <button className="quick-action-btn text-danger" onClick={onDeleteClick}>
          <Trash2 size={16} /> Delete this lead
        </button>
      </div>
    </div>
  );
};

export default LeadQuickActions;

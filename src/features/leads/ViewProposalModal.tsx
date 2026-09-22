import React from 'react';
import { X, FileText, Download, Calendar, Paperclip, RotateCcw } from 'lucide-react';
import { Proposal } from '../../api/types';
import './ViewProposalModal.css';

interface ViewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: (Proposal & { proposalNumber?: number }) | null;
  onRepropose?: () => void;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({ isOpen, onClose, proposal, onRepropose }) => {
  if (!isOpen || !proposal) return null;

  return (
    <div className="proposal-modal-overlay">
      <div className="proposal-modal-container">
        <div className="proposal-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2><FileText size={20} className="header-icon" /> View Proposal</h2>
            {proposal.proposalNumber && (
              <span className="proposal-version-badge">
                Proposal #{proposal.proposalNumber}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onRepropose && (
              <button
                type="button"
                className="view-modal-repropose-btn"
                onClick={onRepropose}
                title="Draft a new revision of this proposal"
              >
                <RotateCcw size={14} />
                <span>Re-propose</span>
              </button>
            )}
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
        </div>
        
        <div className="proposal-modal-body view-mode">
          <div className="proposal-view-header">
            <h3>{proposal.subject}</h3>
            <div className="proposal-date">
              <Calendar size={14} /> 
              {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          
          <div className="proposal-view-content">
            {proposal.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {proposal.attachments && proposal.attachments.length > 0 && (
            <div className="proposal-view-attachments">
              <h4>Attachments ({proposal.attachments.length})</h4>
              <div className="attachments-list">
                {proposal.attachments.map(att => (
                  <div key={att.id} className="attachment-item">
                    <Paperclip size={16} className="att-icon" />
                    <div className="att-info">
                      <span className="att-name">{att.file_name}</span>
                      <span className="att-size">{att.file_size ? (att.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
                    </div>
                    {(att.signedUrl || att.file_path) && (
                      <a href={att.signedUrl || att.file_path} target="_blank" rel="noopener noreferrer" className="att-download" title="Download">
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProposalModal;

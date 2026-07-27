import React, { useState } from 'react';
import { X, FileText, Folder, Calendar, Info, Send, CheckCircle2 } from 'lucide-react';
import './SendProposalModal.css';
import { Lead } from './LeadTable';

interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

const SendProposalModal: React.FC<SendProposalModalProps> = ({ isOpen, onClose, lead }) => {
  const [subject, setSubject] = useState('Business Proposal - kudon');
  const [proposalContent, setProposalContent] = useState(`Hi ${lead.name.split(' ')[0]},\n\nThank you for taking the time to consider Kelesedi Accounting Services as your accounting, tax, and payroll partner in growth.\n\nWe offer three core services designed to simplify your business and strengthen your bottom line:\n\n1. Seamless Payroll Management (from R340 per employee/month) — full payroll administration, IRP5s, UIF, PAYE and SDL submissions, HR support, and leave/overtime tracking.`);
  const [attachFromSystem, setAttachFromSystem] = useState(true); // default true to match screenshot
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    // No API for now
    onClose();
  };

  return (
    <div className="proposal-modal-overlay">
      <div className="proposal-modal-container">
        <div className="proposal-modal-header">
          <h2><FileText size={20} className="header-icon" /> Send Proposal</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="proposal-modal-body">
          <div className="form-group">
            <label>SUBJECT *</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>PROPOSAL CONTENT *</label>
            <textarea 
              value={proposalContent} 
              onChange={(e) => setProposalContent(e.target.value)}
              className="form-control proposal-textarea"
            />
            <div className="ready-to-send-text">
              <CheckCircle2 size={14} /> Ready to send.
            </div>
          </div>

          <div className="form-group">
            <label>ATTACH DOCUMENT (OPTIONAL)</label>
            <div className="file-input-wrapper">
              <input type="file" id="proposal-file" className="file-input" />
              <div className="file-input-display">
                <button className="choose-file-btn">Choose File</button>
                <span className="file-name">No file chosen</span>
              </div>
            </div>
          </div>



          <div className="info-alert">
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>This email will be tracked. Lead will automatically move to Proposed stage.</span>
          </div>
        </div>

        <div className="proposal-modal-footer">
          <button className="btn btn-primary" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} /> Send Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendProposalModal;

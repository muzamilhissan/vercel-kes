import React, { useState } from 'react';
import { X, FileText, Info, Send, CheckCircle2, Loader2, Paperclip } from 'lucide-react';
import './SendProposalModal.css';
import { Lead } from './LeadTable';
import { proposalService } from '../../api/proposalService';
import { useToast } from '../../context/ToastContext';

interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSuccess?: () => void;
}

const SendProposalModal: React.FC<SendProposalModalProps> = ({ isOpen, onClose, lead, onSuccess }) => {
  const [subject, setSubject] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Basic validation: Check sizes (e.g., max 10MB per file)
      const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== selectedFiles.length) {
        showToast('Some files exceed the 10MB limit and were removed.', 'error');
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
    // reset input
    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      showToast('Subject is required', 'error');
      return;
    }
    if (!proposalContent.trim()) {
      showToast('Proposal Content is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('content', proposalContent);
      
      files.forEach((file) => {
        formData.append('attachments[]', file);
      });

      const res = await proposalService.storeProposal(lead.id, formData);

      if (res.success) {
        showToast('Proposal sent successfully', 'success');
        setSubject('');
        setProposalContent('');
        setFiles([]);
        if (onSuccess) onSuccess();
      } else {
        showToast(res.message || 'Failed to send proposal', 'error');
      }
    } catch (error: any) {
      console.error('Error sending proposal:', error);
      showToast(error.message || 'An error occurred while sending the proposal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="proposal-modal-overlay">
      <div className="proposal-modal-container">
        <div className="proposal-modal-header">
          <h2><FileText size={20} className="header-icon" /> Send Proposal</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}><X size={20} /></button>
        </div>
        
        <div className="proposal-modal-body">
          <div className="form-group">
            <label>SUBJECT *</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              className="form-control"
              disabled={isSubmitting}
              placeholder="Enter proposal subject..."
            />
          </div>

          <div className="form-group">
            <label>PROPOSAL CONTENT *</label>
            <textarea 
              value={proposalContent} 
              onChange={(e) => setProposalContent(e.target.value)}
              className="form-control proposal-textarea"
              disabled={isSubmitting}
              maxLength={2000}
              placeholder="Write your proposal content here..."
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div className="ready-to-send-text" style={{ margin: 0 }}>
                <CheckCircle2 size={14} /> Ready to send.
              </div>
              <div className="character-counter" style={{ fontSize: '11px', color: proposalContent.length >= 2000 ? '#ef4444' : '#64748b', fontWeight: 500 }}>
                {proposalContent.length}/2000
              </div>
            </div>
            {proposalContent.length >= 2000 && (
              <div style={{ color: '#ef4444', fontSize: '11px', fontWeight: 500, marginTop: '4px', textAlign: 'left' }}>
                Maximum character limit of 2,000 reached.
              </div>
            )}
          </div>

          <div className="form-group">
            <label>ATTACH DOCUMENTS (OPTIONAL)</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="proposal-file" 
                className="file-input" 
                multiple 
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <div className="file-input-display" onClick={() => document.getElementById('proposal-file')?.click()}>
                <button type="button" className="choose-file-btn" disabled={isSubmitting}>Choose Files</button>
                <span className="file-name">{files.length > 0 ? `${files.length} file(s) selected` : 'No file chosen'}</span>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="selected-files-list">
                {files.map((file, idx) => (
                  <div key={idx} className="selected-file-item">
                    <Paperclip size={14} className="file-icon" />
                    <span className="file-name-text">{file.name}</span>
                    <span className="file-size-text">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" className="remove-file-btn" onClick={() => removeFile(idx)} disabled={isSubmitting}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-alert">
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>This email will be tracked. Lead will automatically move to Proposed stage.</span>
          </div>
        </div>

        <div className="proposal-modal-footer">
          <button 
            className="btn btn-primary" 
            onClick={handleSend} 
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? <Loader2 size={16} className="lucide-spin" /> : <Send size={16} />}
            {isSubmitting ? 'Sending...' : 'Send Proposal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendProposalModal;

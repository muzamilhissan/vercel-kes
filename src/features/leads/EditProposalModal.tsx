import React, { useState, useEffect } from 'react';
import { X, FileText, Send, CheckCircle2, Loader2, Paperclip } from 'lucide-react';
import { Proposal, ProposalAttachment } from '../../api/types';
import { proposalService } from '../../api/proposalService';
import { useToast } from '../../context/ToastContext';
import SelectCompanyDocumentModal from '../documents/SelectCompanyDocumentModal';
import { CompanyDocument } from '../../api/types';
import './SendProposalModal.css'; // Reusing the same styles

interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | number;
  proposal: Proposal | null;
  onSuccess?: () => void;
}

const EditProposalModal: React.FC<EditProposalModalProps> = ({ isOpen, onClose, leadId, proposal, onSuccess }) => {
  const [subject, setSubject] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [existingAttachments, setExistingAttachments] = useState<ProposalAttachment[]>([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<(string | number)[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [selectedLibraryDocs, setSelectedLibraryDocs] = useState<CompanyDocument[]>([]);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();

  useEffect(() => {
    if (proposal && isOpen) {
      setSubject(proposal.subject);
      setProposalContent(proposal.content);
      setExistingAttachments(proposal.attachments || []);
      setDeletedAttachmentIds([]);
      setNewFiles([]);
      setSelectedLibraryDocs([]);
    }
  }, [proposal, isOpen]);

  if (!isOpen || !proposal) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length !== selectedFiles.length) {
        showToast('Some files exceed the 10MB limit and were removed.', 'error');
      }

      setNewFiles(prev => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeNewFile = (indexToRemove: number) => {
    setNewFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeExistingAttachment = (attId: string | number) => {
    setExistingAttachments(prev => prev.filter(att => att.id !== attId));
    setDeletedAttachmentIds(prev => [...prev, attId]);
  };

  const removeLibraryDoc = (docId: string | number) => {
    setSelectedLibraryDocs((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const handleUpdate = async () => {
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
      
      // Send the IDs of attachments that should be kept as a comma-separated string
      formData.append('existing_attachments', existingAttachments.map(att => att.id).join(','));
      
      // Handle deleted attachments if API supports it as a comma-separated string
      formData.append('deleted_attachments', deletedAttachmentIds.join(','));

      newFiles.forEach((file) => {
        formData.append('attachments[]', file);
      });

      selectedLibraryDocs.forEach((doc) => {
        formData.append('company_document_ids[]', doc.id.toString());
      });

      const res = await proposalService.updateProposal(leadId, proposal.id, formData);

      if (res.success) {
        showToast('Proposal updated successfully', 'success');
        if (onSuccess) onSuccess();
      } else {
        showToast(res.message || 'Failed to update proposal', 'error');
      }
    } catch (error: any) {
      console.error('Error updating proposal:', error);
      showToast(error.message || 'An error occurred while updating the proposal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="proposal-modal-overlay">
      <div className="proposal-modal-container">
        <div className="proposal-modal-header">
          <h2><FileText size={20} className="header-icon" /> Edit Proposal</h2>
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
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '4px',
              }}
            >
              <div
                className="character-counter"
                style={{
                  fontSize: '11px',
                  color: proposalContent.length >= 2000 ? '#ef4444' : '#64748b',
                  fontWeight: 500,
                }}
              >
                {proposalContent.length}/2000
              </div>
            </div>
            {proposalContent.length >= 2000 && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 500,
                  marginTop: '4px',
                  textAlign: 'right'
                }}
              >
                Maximum character limit reached
              </div>
            )}
          </div>

          <div className="form-group">
            <label>ATTACHMENTS</label>
            
            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div className="selected-files-list" style={{ marginBottom: '12px' }}>
                {existingAttachments.map((att) => (
                  <div key={att.id} className="selected-file-item">
                    <Paperclip size={14} className="file-icon" />
                    <span className="file-name-text">{att.file_name}</span>
                    <span className="file-size-text">
                      {att.file_size ? `(${(att.file_size / 1024).toFixed(1)} KB)` : ''}
                    </span>
                    <button type="button" className="remove-file-btn" onClick={() => removeExistingAttachment(att.id)} disabled={isSubmitting}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="edit-proposal-file" 
                className="file-input" 
                multiple 
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="file-input-display" onClick={() => document.getElementById('edit-proposal-file')?.click()} style={{ flex: 1 }}>
                  <button type="button" className="choose-file-btn" disabled={isSubmitting}>Add More Files</button>
                  <span className="file-name">{newFiles.length > 0 ? `${newFiles.length} new file(s) selected` : 'Select files to add'}</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsLibraryModalOpen(true)}
                  disabled={isSubmitting}
                  style={{ height: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={16} />
                  Browse Library
                </button>
              </div>
            </div>
            
            {/* New Files & Library Docs */}
            {(newFiles.length > 0 || selectedLibraryDocs.length > 0) && (
              <div className="selected-files-list">
                {newFiles.map((file, idx) => (
                  <div key={idx} className="selected-file-item" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                    <Paperclip size={14} className="file-icon" style={{ color: '#22c55e' }} />
                    <span className="file-name-text">{file.name} (New)</span>
                    <span className="file-size-text">({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" className="remove-file-btn" onClick={() => removeNewFile(idx)} disabled={isSubmitting}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedLibraryDocs.map((doc, idx) => (
                  <div key={`lib-${doc.id}`} className="selected-file-item" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <FileText size={14} className="file-icon" style={{ color: '#70309f' }} />
                    <span className="file-name-text">{doc.file_name} (Library)</span>
                    <span className="file-size-text">
                      {doc.file_size ? `(${(doc.file_size / 1024).toFixed(1)} KB)` : ''}
                    </span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeLibraryDoc(doc.id)}
                      disabled={isSubmitting}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="proposal-modal-footer">
          <button 
            className="btn btn-primary" 
            onClick={handleUpdate} 
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? <Loader2 size={16} className="lucide-spin" /> : <CheckCircle2 size={16} />}
            {isSubmitting ? 'Updating...' : 'Update Proposal'}
          </button>
        </div>
      </div>

      <SelectCompanyDocumentModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectDocuments={(docs) => {
          setSelectedLibraryDocs((prev) => {
            const newDocs = [...prev];
            docs.forEach(d => {
              if (!newDocs.find(x => x.id === d.id)) newDocs.push(d);
            });
            return newDocs;
          });
        }}
      />
    </div>
  );
};

export default EditProposalModal;

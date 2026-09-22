import React from 'react';
import { CheckCircle2, ExternalLink, FileText, Info, Paperclip, X } from 'lucide-react';
import { CompanyDocument } from '../../../api/types';

interface ProposalReviewStepProps {
  isRepropose: boolean;
  proposalNumber: number;
  subject: string;
  setSubject: (subject: string) => void;
  proposalContent: string;
  setProposalContent: (content: string) => void;
  isSubmitting: boolean;
  generatedPdfUrl: string | null;
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (idx: number) => void;
  setIsLibraryModalOpen: (open: boolean) => void;
  selectedLibraryDocs: CompanyDocument[];
  removeLibraryDoc: (id: number | string) => void;
}

const ProposalReviewStep: React.FC<ProposalReviewStepProps> = ({
  isRepropose,
  proposalNumber,
  subject,
  setSubject,
  proposalContent,
  setProposalContent,
  isSubmitting,
  generatedPdfUrl,
  files,
  handleFileChange,
  removeFile,
  setIsLibraryModalOpen,
  selectedLibraryDocs,
  removeLibraryDoc,
}) => {
  return (
    <div className="review-step-container">
      <div className="success-generated-banner">
        <CheckCircle2 size={18} className="banner-icon" />
        <div className="banner-text">
          <strong>
            {isRepropose
              ? `Proposal #${proposalNumber} generated successfully!`
              : 'Proposal content generated successfully!'}
          </strong>
          <span>
            Review and tailor the subject line and content below. You can also attach
            supporting files before sending.
          </span>
        </div>
      </div>

      {/* Subject */}
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

      {/* Proposal Content */}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px',
          }}
        >
          <div className="ready-to-send-text" style={{ margin: 0 }}>
            <CheckCircle2 size={14} /> Ready to send.
          </div>
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
          <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            Maximum character limit reached (2000).
          </div>
        )}
      </div>

      {/* Generated PDF Document (if available) */}
      {generatedPdfUrl && (
        <div className="generated-doc-preview">
          <div className="doc-card-left">
            <div className="doc-icon-badge">
              <FileText size={20} />
            </div>
            <div className="doc-card-info">
              <span className="doc-card-title">Generated Proposal Document (PDF)</span>
              <span className="doc-card-sub">
                Automated proposal synthesized from requirements
              </span>
            </div>
          </div>
          <a
            href={generatedPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-preview-link"
          >
            <ExternalLink size={14} /> View / Download PDF
          </a>
        </div>
      )}

      {/* Additional Attachments */}
      <div className="form-group">
        <label>ATTACH ADDITIONAL DOCUMENTS (OPTIONAL)</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="proposal-file"
            className="file-input"
            multiple
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              className="file-input-display"
              onClick={() => document.getElementById('proposal-file')?.click()}
              style={{ flex: 1 }}
            >
              <button type="button" className="choose-file-btn" disabled={isSubmitting}>
                Choose Files
              </button>
              <span className="file-name">
                {files.length > 0 ? `${files.length} file(s) selected` : 'No file chosen'}
              </span>
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

        {(files.length > 0 || selectedLibraryDocs.length > 0) && (
          <div className="selected-files-list">
            {files.map((file, idx) => (
              <div key={`file-${idx}`} className="selected-file-item">
                <Paperclip size={14} className="file-icon" />
                <span className="file-name-text">{file.name}</span>
                <span className="file-size-text">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={() => removeFile(idx)}
                  disabled={isSubmitting}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {selectedLibraryDocs.map((doc, idx) => (
              <div key={`lib-${doc.id}`} className="selected-file-item" style={{ background: '#f8fafc' }}>
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

      <div className="info-alert">
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>This email will be tracked. Lead will automatically move to Proposed stage.</span>
      </div>
    </div>
  );
};

export default ProposalReviewStep;

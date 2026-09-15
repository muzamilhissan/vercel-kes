import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Info,
  Send,
  CheckCircle2,
  Loader2,
  Paperclip,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import './SendProposalModal.css';
import { Lead } from './LeadTable';
import { proposalService } from '../../api/proposalService';
import { ProposalOptionsData, CreateProposalRequestInput } from '../../api/types';
import { useToast } from '../../context/ToastContext';

interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSuccess?: () => void;
  isRepropose?: boolean;
  proposalNumber?: number;
}

const SendProposalModal: React.FC<SendProposalModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
  isRepropose = false,
  proposalNumber = 1,
}) => {
  // Stepper state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Questionnaire state
  const [options, setOptions] = useState<ProposalOptionsData | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState<number | null>(null);
  const [plantName, setPlantName] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [selectedMainPurposeId, setSelectedMainPurposeId] = useState<number | null>(null);
  const [selectedCommercialApproachId, setSelectedCommercialApproachId] = useState<number | null>(null);

  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  // Proposal form state
  const [subject, setSubject] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  // Load options when modal opens & reset state cleanly
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsGenerating(false);
      setSubject('');
      setProposalContent('');
      setFiles([]);
      setGeneratedPdfUrl(null);
      if (!options) {
        fetchOptions();
      }
    } else {
      // Reset step to 1 when modal closes
      setCurrentStep(1);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const res = await proposalService.getProposalOptions();
      if (res.success && res.options) {
        setOptions(res.options);
      } else {
        showToast(res.message || 'Failed to load proposal options', 'error');
      }
    } catch (error: any) {
      console.error('Error loading options:', error);
      showToast(error.message || 'Failed to load questionnaire options', 'error');
    } finally {
      setIsLoadingOptions(false);
    }
  };

  if (!isOpen) return null;

  // Sorting PPC operations so "A specific PPC plant" comes last (like screenshot)
  const sortedOperations = options?.ppc_operations
    ? [...options.ppc_operations].sort((a, b) => {
        const aIsSpecific = a.name.toLowerCase().includes('specific');
        const bIsSpecific = b.name.toLowerCase().includes('specific');
        if (aIsSpecific && !bIsSpecific) return 1;
        if (!aIsSpecific && bIsSpecific) return -1;
        return a.id - b.id;
      })
    : [];

  const isSpecificPlantSelected = Boolean(
    options?.ppc_operations.find(
      (op) => op.id === selectedOperationId && op.name.toLowerCase().includes('specific')
    )
  );

  const toggleService = (serviceId: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAllServices = () => {
    if (!options) return;
    if (selectedServiceIds.length === options.services.length) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(options.services.map((s) => s.id));
    }
  };

  const isStep1Valid = Boolean(
    selectedOperationId &&
    (!isSpecificPlantSelected || plantName.trim().length > 0) &&
    selectedServiceIds.length > 0 &&
    selectedMainPurposeId &&
    selectedCommercialApproachId
  );

  const handleGenerateProposal = async () => {
    if (!isStep1Valid) {
      if (!selectedOperationId) {
        showToast('Please select a PPC operation', 'error');
      } else if (isSpecificPlantSelected && !plantName.trim()) {
        showToast('Please enter the specific plant name', 'error');
      } else if (selectedServiceIds.length === 0) {
        showToast('Please select at least one service', 'error');
      } else if (!selectedMainPurposeId) {
        showToast('Please select the main purpose', 'error');
      } else if (!selectedCommercialApproachId) {
        showToast('Please select a commercial approach', 'error');
      }
      return;
    }

    setIsGenerating(true);
    try {
      const payload: CreateProposalRequestInput = {
        ppc_operation_id: selectedOperationId!,
        ...(isSpecificPlantSelected ? { plant_name: plantName.trim() } : {}),
        service_ids: selectedServiceIds,
        main_purpose_id: selectedMainPurposeId!,
        commercial_approach_id: selectedCommercialApproachId!,
      };

      const res = await proposalService.storeProposalRequest(lead.id, payload);

      if (res.success && res.proposal_request?.generated_content) {
        const generated = res.proposal_request.generated_content;
        setSubject(generated.email_subject || '');
        setProposalContent(generated.email_body || '');
        setGeneratedPdfUrl(generated.proposal_download_url || null);
        setCurrentStep(2);
        showToast('Proposal generated successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to generate proposal content', 'error');
      }
    } catch (error: any) {
      console.error('Error generating proposal:', error);
      showToast(error.message || 'An error occurred while generating proposal content', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => file.size <= 10 * 1024 * 1024);

      if (validFiles.length !== selectedFiles.length) {
        showToast('Some files exceed the 10MB limit and were removed.', 'error');
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
        showToast(
          isRepropose ? `Proposal #${proposalNumber} sent successfully!` : 'Proposal sent successfully',
          'success'
        );
        setSubject('');
        setProposalContent('');
        setFiles([]);
        setGeneratedPdfUrl(null);
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
      <div className="proposal-modal-container wider-stepper-container">
        {/* Modal Header */}
        <div className="proposal-modal-header">
          <div className="header-title-area">
            <h2>
              {isRepropose ? (
                <RotateCcw size={20} className="header-icon repropose-header-icon" />
              ) : (
                <FileText size={20} className="header-icon" />
              )}
              {isRepropose ? 'Re-propose Lead' : 'Send Proposal'}
            </h2>
            <div className="header-subtitle-row">
              {isRepropose && (
                <span className="proposal-version-badge">
                  Proposal #{proposalNumber}
                </span>
              )}
              <span className="lead-tag">
                Lead: {lead.name} {lead.company ? `(${lead.company})` : ''}
              </span>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            disabled={isSubmitting || isGenerating}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Indicator Bar */}
        <div className="proposal-stepper-bar">
          <div className="stepper-inner-container">
            <div
              className={`stepper-item ${currentStep === 1 ? 'active' : 'completed'}`}
              onClick={() => !isGenerating && setCurrentStep(1)}
            >
              <div className="stepper-bubble">
                {currentStep > 1 ? <Check size={13} /> : '1'}
              </div>
              <div className="stepper-texts">
                <span className="step-name">Step 1: Requirements</span>
                <span className="step-hint">
                  {isRepropose ? 'Adjust scope & parameters' : 'Select scope & parameters'}
                </span>
              </div>
            </div>

            <div className={`stepper-track ${currentStep > 1 ? 'filled' : ''}`} />

            <div className={`stepper-item ${currentStep === 2 ? 'active' : ''}`}>
              <div className="stepper-bubble">2</div>
              <div className="stepper-texts">
                <span className="step-name">Step 2: Review & Send</span>
                <span className="step-hint">
                  {isRepropose ? `Review Proposal #${proposalNumber}` : 'Review generated content'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="proposal-modal-body">
          {isGenerating ? (
            /* AI Generation Loading Screen */
            <div className="ai-generating-state">
              <div className="ai-sparkle-halo">
                <Sparkles size={38} className="ai-sparkle-icon" />
              </div>
              <h3 className="ai-generating-title">
                {isRepropose
                  ? `Generating Proposal #${proposalNumber} with AI...`
                  : 'Generating Proposal with AI...'}
              </h3>
              <p className="ai-generating-desc">
                Analyzing your requirements for <strong>{lead.company || lead.name}</strong> and
                synthesizing a customized {isRepropose ? 're-proposal' : 'proposal'} letter and documentation.
              </p>
              <div className="ai-progress-bar-wrap">
                <div className="ai-progress-bar-fill" />
              </div>
              <span className="ai-progress-hint">This usually takes about 10–15 seconds...</span>
            </div>
          ) : currentStep === 1 ? (
            /* STEP 1: Questionnaire */
            <div className="questionnaire-step-container">
              {isLoadingOptions ? (
                <div className="loading-options-state">
                  <Loader2 size={32} className="lucide-spin" />
                  <span>Loading proposal options...</span>
                </div>
              ) : options ? (
                <div className="questionnaire-grid">
                  {/* Column 1: Which PPC operation? */}
                  <div className="question-col">
                    <div className="question-col-header">
                      <h4 className="question-heading">1. Which PPC operation?</h4>
                    </div>
                    <div className="options-list">
                      {sortedOperations.map((op) => {
                        const isSpecific = op.name.toLowerCase().includes('specific');
                        const isChecked = selectedOperationId === op.id;
                        return (
                          <div key={op.id} className="option-row-wrapper">
                            <label className={`option-label radio-label ${isChecked ? 'selected' : ''}`}>
                              <input
                                type="radio"
                                name="ppc_operation"
                                value={op.id}
                                checked={isChecked}
                                onChange={() => setSelectedOperationId(op.id)}
                              />
                              <span className="option-text">{op.name}</span>
                            </label>

                            {/* Specific plant text input */}
                            {isSpecific && isChecked && (
                              <div className="plant-name-input-block">
                                <label className="plant-input-label">Plant name, if applicable</label>
                                <input
                                  type="text"
                                  className="form-control plant-name-input"
                                  placeholder="Enter the PPC plant or location..."
                                  value={plantName}
                                  onChange={(e) => setPlantName(e.target.value)}
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: Which services? (Multiselect) */}
                  <div className="question-col">
                    <div className="question-col-header">
                      <h4 className="question-heading">
                        2. Which services?{' '}
                        <span className="question-subtext">Select all that apply</span>
                      </h4>
                      <button
                        type="button"
                        className="select-all-btn"
                        onClick={handleSelectAllServices}
                      >
                        {selectedServiceIds.length === options.services.length
                          ? 'Clear all'
                          : 'Select all'}
                      </button>
                    </div>
                    <div className="options-list">
                      {options.services.map((service) => {
                        const isChecked = selectedServiceIds.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className={`option-label checkbox-label ${isChecked ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleService(service.id)}
                            />
                            <span className="option-text">{service.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: What is the main purpose? */}
                  <div className="question-col">
                    <div className="question-col-header">
                      <h4 className="question-heading">3. What is the main purpose?</h4>
                    </div>
                    <div className="options-list">
                      {options.main_purposes.map((purpose) => {
                        const isChecked = selectedMainPurposeId === purpose.id;
                        return (
                          <label
                            key={purpose.id}
                            className={`option-label radio-label ${isChecked ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="main_purpose"
                              value={purpose.id}
                              checked={isChecked}
                              onChange={() => setSelectedMainPurposeId(purpose.id)}
                            />
                            <span className="option-text">{purpose.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 4: Which commercial approach? */}
                  <div className="question-col">
                    <div className="question-col-header">
                      <h4 className="question-heading">4. Which commercial approach?</h4>
                    </div>
                    <div className="options-list">
                      {options.commercial_approaches.map((approach) => {
                        const isChecked = selectedCommercialApproachId === approach.id;
                        return (
                          <label
                            key={approach.id}
                            className={`option-label radio-label ${isChecked ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="commercial_approach"
                              value={approach.id}
                              checked={isChecked}
                              onChange={() => setSelectedCommercialApproachId(approach.id)}
                            />
                            <span className="option-text">{approach.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="options-error-state">
                  <p>Unable to load options.</p>
                  <button className="btn btn-secondary" onClick={fetchOptions}>
                    <RotateCcw size={14} /> Retry
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: Review & Send Form */
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
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '11px',
                      fontWeight: 500,
                      marginTop: '4px',
                      textAlign: 'left',
                    }}
                  >
                    Maximum character limit of 2,000 reached.
                  </div>
                )}
              </div>

              {/* Generated PDF Document Card if available */}
              {generatedPdfUrl && (
                <div className="generated-doc-card">
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
                  <div
                    className="file-input-display"
                    onClick={() => document.getElementById('proposal-file')?.click()}
                  >
                    <button type="button" className="choose-file-btn" disabled={isSubmitting}>
                      Choose Files
                    </button>
                    <span className="file-name">
                      {files.length > 0 ? `${files.length} file(s) selected` : 'No file chosen'}
                    </span>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="selected-files-list">
                    {files.map((file, idx) => (
                      <div key={idx} className="selected-file-item">
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
                  </div>
                )}
              </div>

              <div className="info-alert">
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>This email will be tracked. Lead will automatically move to Proposed stage.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="proposal-modal-footer">
          {currentStep === 1 ? (
            <div className="footer-actions-step1">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <div className="footer-right-buttons">
                <button
                  type="button"
                  className="btn btn-ghost skip-to-form-btn"
                  onClick={() => setCurrentStep(2)}
                  disabled={isGenerating}
                >
                  Skip to blank form →
                </button>
                <button
                  type="button"
                  className="btn btn-primary generate-btn"
                  onClick={handleGenerateProposal}
                  disabled={!isStep1Valid || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="lucide-spin" />
                      <span>Generating with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>{isRepropose ? `Generate Proposal #${proposalNumber}` : 'Generate Proposal'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="footer-actions-step2">
              <button
                type="button"
                className="btn btn-secondary back-btn"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                <span>Back to Requirements</span>
              </button>
              <button
                type="button"
                className="btn btn-primary send-proposal-btn"
                onClick={handleSend}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="lucide-spin" />
                ) : (
                  <Send size={16} />
                )}
                <span>
                  {isSubmitting
                    ? 'Sending...'
                    : isRepropose
                    ? `Send Proposal #${proposalNumber}`
                    : 'Send Proposal'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendProposalModal;

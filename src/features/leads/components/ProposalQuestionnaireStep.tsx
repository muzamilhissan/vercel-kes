import React from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import { ProposalOptionsData } from '../../../api/types';

interface ProposalQuestionnaireStepProps {
  isLoadingOptions: boolean;
  options: ProposalOptionsData | null;
  selectedServiceIds: number[];
  toggleService: (id: number) => void;
  handleSelectAllServices: () => void;
  selectedMainPurposeId: number | null;
  setSelectedMainPurposeId: (id: number) => void;
  selectedCommercialApproachId: number | null;
  setSelectedCommercialApproachId: (id: number) => void;
  fetchOptions: () => void;
}

const ProposalQuestionnaireStep: React.FC<ProposalQuestionnaireStepProps> = ({
  isLoadingOptions,
  options,
  selectedServiceIds,
  toggleService,
  handleSelectAllServices,
  selectedMainPurposeId,
  setSelectedMainPurposeId,
  selectedCommercialApproachId,
  setSelectedCommercialApproachId,
  fetchOptions,
}) => {
  return (
    <div className="questionnaire-step-container">
      {isLoadingOptions ? (
        <div className="loading-options-state">
          <Loader2 size={32} className="lucide-spin" />
          <span>Loading proposal options...</span>
        </div>
      ) : options ? (
        <div className="questionnaire-grid">
          {/* Column 1: Which services? (Multiselect) */}
          <div className="question-col">
            <div className="question-col-header">
              <h4 className="question-heading">
                1. Which services?{' '}
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

          {/* Column 2: What is the main purpose? */}
          <div className="question-col">
            <div className="question-col-header">
              <h4 className="question-heading">2. What is the main purpose?</h4>
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

          {/* Column 3: Which commercial approach? */}
          <div className="question-col">
            <div className="question-col-header">
              <h4 className="question-heading">3. Which commercial approach?</h4>
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
  );
};

export default ProposalQuestionnaireStep;

import React from 'react';
import { Check } from 'lucide-react';

interface LeadDetailsStepperProps {
  currentStatus: string;
}

const STAGES = ['New', 'Contacted', 'Proposed', 'Closed'];

const LeadDetailsStepper: React.FC<LeadDetailsStepperProps> = ({ currentStatus }) => {
  let currentIndex = STAGES.indexOf(currentStatus);
  if (['Qualified', 'Disqualified', 'Converted'].includes(currentStatus)) {
    currentIndex = 3;
  }

  return (
    <div className="lead-stepper">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isDisqualified = currentStatus === 'Disqualified' && index < 3; // Only disable previous steps if needed, but Closed will be active

        let hoverTitle = '';
        if (index === 3 && currentIndex === 3) {
          hoverTitle = currentStatus;
        }
        
        return (
          <React.Fragment key={stage}>
            <div 
              className={`stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isDisqualified ? 'disabled' : ''}`}
              data-tooltip={hoverTitle ? hoverTitle : undefined}
            >
              <div className="stepper-circle">
                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
              </div>
              <span className="stepper-label">{stage}</span>
            </div>
            {index < STAGES.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LeadDetailsStepper;

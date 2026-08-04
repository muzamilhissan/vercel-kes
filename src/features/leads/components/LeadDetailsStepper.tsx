import React from 'react';
import { Check } from 'lucide-react';

interface LeadDetailsStepperProps {
  currentStatus: string;
}

const LeadDetailsStepper: React.FC<LeadDetailsStepperProps> = ({ currentStatus }) => {
  const finalStage = ['Qualified', 'Disqualified', 'Converted'].includes(currentStatus)
    ? currentStatus
    : 'Closed';

  const stages = ['New', 'Contacted', 'Proposed', finalStage];
  
  let activeIndex = 0;
  let completedCount = 0;

  if (currentStatus === 'New') {
    activeIndex = 0;
    completedCount = 0;
  } else if (currentStatus === 'Contacted') {
    activeIndex = 2; // Active is Proposed
    completedCount = 2; // New and Contacted are completed
  } else if (currentStatus === 'Proposed') {
    activeIndex = 3; // Active is Closed/Terminal
    completedCount = 3; // New, Contacted, and Proposed are completed
  } else if (['Qualified', 'Disqualified', 'Converted'].includes(currentStatus)) {
    activeIndex = 3;
    completedCount = 4; // All steps completed
  }

  return (
    <div className="lead-stepper">
      {stages.map((stage, index) => {
        const isCompleted = index < completedCount;
        const isActive = index === activeIndex && !isCompleted;

        return (
          <React.Fragment key={stage}>
            <div 
              className={`stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="stepper-circle">
                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
              </div>
              <span className="stepper-label">{stage}</span>
            </div>
            {index < stages.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LeadDetailsStepper;

import React from 'react';
import './ReportCard.css';

interface ReportCardProps {
  title: string;
  children: React.ReactNode;
  onExport?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, children, onExport }) => {
  return (
    <div className="report-card">
      <div className="report-card-header">
        <h3>{title}</h3>
        {onExport && (
          <button className="export-btn" onClick={onExport}>
            Export to CSV
          </button>
        )}
      </div>
      <div className="report-card-body">
        {children}
      </div>
    </div>
  );
};

export default ReportCard;

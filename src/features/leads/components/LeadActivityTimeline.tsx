import React from 'react';
import { Clock } from 'lucide-react';
import { Lead } from '../LeadTable';

interface LeadActivityTimelineProps {
  lead: Lead;
}

const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({ lead }) => {
  return (
    <div className="lead-details-card">
      <div className="card-header">
        <Clock size={16} className="header-icon" />
        <h3>Activity Timeline</h3>
      </div>
      <div className="card-body">
        <div className="timeline-item" style={{ position: 'relative', paddingLeft: '16px', borderLeft: '3px solid #3b82f6' }}>
          <div className="timeline-content">
            <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '14px', color: '#1e293b' }}>System</strong>
              <span className="timeline-date" style={{ fontSize: '12px', color: '#94a3b8' }}>{lead.dateAdded || 'N/A'}</span>
            </div>
            <div className="timeline-body" style={{ fontSize: '13px', color: '#64748b' }}>Lead created</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadActivityTimeline;

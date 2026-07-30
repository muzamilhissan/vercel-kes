import React from 'react';
import { Lead } from '../LeadTable';
import { Info } from 'lucide-react';

interface LeadDetailsCardProps {
  lead: Lead;
}

const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead }) => {
  const formatRevenue = (value: number | undefined) => {
    if (value === undefined || isNaN(Number(value))) return 'R 0';
    return `R ${Number(value).toLocaleString()}`;
  };

  const formatProbability = (value: number | undefined) => {
    if (value === undefined || isNaN(Number(value))) return '0%';
    return `${Number(value)}%`;
  };

  return (
    <div className="lead-details-card">
      <div className="card-header">
        <Info size={16} className="header-icon" />
        <h3>Lead Details</h3>
      </div>
      <div className="card-body highlighted-body">
        <div className="info-row">
          <span className="info-label">Stage:</span>
          <span 
            className="info-value"
            style={{
              color: lead.status === 'Disqualified' ? '#ef4444' : lead.status === 'Qualified' ? '#22c55e' : undefined,
              fontWeight: (lead.status === 'Disqualified' || lead.status === 'Qualified') ? 600 : undefined
            }}
          >
            {lead.status}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Expected Revenue:</span>
          <span className="info-value">{formatRevenue(lead.expected_revenue)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Probability:</span>
          <span className="info-value">{formatProbability(lead.probability)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Assigned To:</span>
          <span className="info-value">Unassigned</span>
        </div>
        <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', marginTop: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
          <span className="info-label">Notes:</span>
          <span className="info-value" style={{ whiteSpace: 'pre-wrap', color: '#475569', fontSize: '13px', lineHeight: '1.5', width: '100%' }}>
            {lead.notes || 'No notes added'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsCard;

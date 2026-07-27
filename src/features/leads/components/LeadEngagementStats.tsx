import React from 'react';
import { BarChart3 } from 'lucide-react';

const LeadEngagementStats: React.FC = () => {
  return (
    <div className="lead-details-card">
      <div className="card-header">
        <BarChart3 size={16} className="header-icon" />
        <h3>Engagement Stats</h3>
      </div>
      <div className="card-body stat-body" style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '24px', borderRadius: '8px' }}>
        <div className="stat-box" style={{ flex: 1 }}>
          <div className="stat-value" style={{ color: '#10b981', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>0</div>
          <div className="stat-label" style={{ color: '#64748b', fontSize: '13px' }}>Emails Sent</div>
        </div>
        <div className="stat-box" style={{ flex: 1 }}>
          <div className="stat-value" style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>0</div>
          <div className="stat-label" style={{ color: '#64748b', fontSize: '13px' }}>Responses</div>
        </div>
      </div>
    </div>
  );
};

export default LeadEngagementStats;

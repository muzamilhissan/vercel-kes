import React from 'react';
import { Lead } from '../LeadTable';
import { Info, UserCheck, UserPlus } from 'lucide-react';
import { getAssigneeAvatar } from '../utils';

interface LeadDetailsCardProps {
  lead: Lead;
  isSuperAdmin?: boolean;
  onAssignClick?: () => void;
}

const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead, isSuperAdmin = false, onAssignClick }) => {
  const formatRevenue = (value: number | undefined) => {
    if (value === undefined || isNaN(Number(value))) return 'R 0';
    return `R ${Number(value).toLocaleString()}`;
  };

  const formatProbability = (value: number | undefined) => {
    if (value === undefined || isNaN(Number(value))) return '0%';
    return `${Number(value)}%`;
  };

  const assignees = lead.assigned_users || lead.assignees || (lead.assignee ? [lead.assignee] : []);

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
        <div className="info-row" style={{ alignItems: 'flex-start' }}>
          <span className="info-label" style={{ marginTop: '2px' }}>Assigned To:</span>
          <div className="info-value" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flex: 1 }}>
            {assignees.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                {assignees.map((user, idx) => (
                  <div key={user.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img 
                      src={user.avatar || getAssigneeAvatar(user.name || user.fullName || 'User')} 
                      alt={user.name} 
                      style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      {user.fullName || user.name}
                    </span>
                  </div>
                ))}
                {isSuperAdmin && onAssignClick && (
                  <button 
                    onClick={onAssignClick}
                    style={{
                      marginTop: '2px',
                      background: 'none',
                      border: 'none',
                      color: '#70309f',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Reassign
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Unassigned</span>
                {isSuperAdmin && onAssignClick && (
                  <button 
                    onClick={onAssignClick}
                    style={{
                      background: '#f3e8ff',
                      border: '1px solid #d8b4fe',
                      borderRadius: '6px',
                      color: '#70309f',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <UserPlus size={12} /> Assign
                  </button>
                )}
              </div>
            )}
          </div>
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

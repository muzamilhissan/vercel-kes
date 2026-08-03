import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Coins } from 'lucide-react';
import { Lead } from './LeadTable';
import '../kanban/KanbanColumn.css';
import '../kanban/KanbanCard.css';
import './LeadKanbanBoard.css';

import { MOCK_ASSIGNEES } from './utils';
interface LeadKanbanCardProps {
  lead: Lead;
  color: string;
  onClick: (lead: Lead) => void;
  onAssign: (lead: Lead, userId: string) => void;
}

const LeadKanbanCard: React.FC<LeadKanbanCardProps> = ({ lead, color, onClick, onAssign }) => {
  // Removed assignee logic per requirements

  return (
    <div className="kanban-card" onClick={() => onClick(lead)} style={{ backgroundColor: `${color}08`, border: `1px solid ${color}30`, position: 'relative' }}>
      <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 className="deal-name" style={{ flex: 1, paddingRight: '8px' }}>{lead.name}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          {lead.dateAdded && (
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {new Date(lead.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {(lead.expected_revenue !== undefined || lead.probability !== undefined) && (
            <div className="meta-item" style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              <Coins size={12} />
              <span>
                {lead.expected_revenue ? `R ${lead.expected_revenue.toLocaleString()}` : 'R 0'} 
                {lead.probability ? ` (${lead.probability}%)` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="card-tags">
        {lead.industry && lead.industry.trim() !== '-' && lead.industry.trim() !== '' && (
          <span className="id-tag">{lead.industry}</span>
        )}
        {lead.company && (
          <span className="feature-tag" style={{ backgroundColor: '#3b82f612', color: '#3b82f6' }}>
            {lead.company}
          </span>
        )}
        {(lead.status === 'Qualified' || lead.status === 'Disqualified') && (
          <span className="feature-tag" style={{ 
            backgroundColor: lead.status === 'Qualified' ? '#10b98112' : '#ef444412', 
            color: lead.status === 'Qualified' ? '#10b981' : '#ef4444',
            border: `1.5px solid ${lead.status === 'Qualified' ? '#10b98130' : '#ef444430'}`
          }}>
            {lead.status}
          </span>
        )}
      </div>

      <div className="card-bottom" style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div className="card-meta" style={{ flex: 1, minWidth: 0 }}>
          <div className="meta-item" style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            {lead.email}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LeadKanbanColumnProps {
  title: string;
  count: number;
  leads: Lead[];
  color: string;
  onCardClick: (lead: Lead) => void;
  onAssign: (lead: Lead, userId: string) => void;
}

const LeadKanbanColumn: React.FC<LeadKanbanColumnProps> = ({ title, count, leads, color, onCardClick, onAssign }) => {
  const [visibleCount, setVisibleCount] = React.useState(20);
  const observer = React.useRef<IntersectionObserver | null>(null);

  const loadMoreRef = React.useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    
    if (node) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 20);
        }
      });
      observer.current.observe(node);
    }
  }, []);

  const visibleLeads = leads.slice(0, visibleCount);

  return (
    <div className="kanban-column">
      <div className="column-header" style={{ borderTop: `4px solid ${color}` }}>
        <div className="column-header-left">
          <h3 className="column-title">{title}</h3>
          <span className="column-count" style={{ backgroundColor: `${color}20`, color: color }}>{count}</span>
        </div>
      </div>

      <div 
        className="column-content" 
        style={{ overflowY: 'auto', flex: 1 }}
      >
        {visibleLeads.map(lead => (
          <LeadKanbanCard key={lead.id} lead={lead} color={color} onClick={onCardClick} onAssign={onAssign} />
        ))}
        {leads.length > visibleCount && (
          <div ref={loadMoreRef} style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            Loading more...
          </div>
        )}
        {leads.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
            No leads in this stage
          </div>
        )}
      </div>
    </div>
  );
};

interface LeadKanbanBoardProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onAssign?: (lead: Lead, userId: string) => void;
}

const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({ leads, onView, onAssign }) => {
  const getLeadsForColumn = (status: string) => {
    if (status === 'Closed') {
      return leads.filter(lead => lead.status === 'Qualified' || lead.status === 'Disqualified');
    }
    return leads.filter(lead => lead.status === status);
  };

  const columns = [
    { title: 'New', status: 'New', color: '#3b82f6' },
    { title: 'Contacted', status: 'Contacted', color: '#f59e0b' },
    { title: 'Proposed', status: 'Proposed', color: '#8b5cf6' },
    { title: 'Closed', status: 'Closed', color: '#64748b' }
  ];

  return (
    <div className="lead-kanban-board">
      {columns.map(col => {
        const columnLeads = getLeadsForColumn(col.status);
        return (
          <LeadKanbanColumn 
            key={col.status} 
            title={col.title} 
            count={columnLeads.length} 
            leads={columnLeads} 
            color={col.color}
            onCardClick={onView}
            onAssign={onAssign || (() => {})}
          />
        );
      })}
    </div>
  );
};

export default LeadKanbanBoard;

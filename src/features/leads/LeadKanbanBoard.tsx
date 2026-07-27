import React from 'react';
import { Lead } from './LeadTable';
import '../kanban/KanbanColumn.css';
import '../kanban/KanbanCard.css';
import './LeadKanbanBoard.css';

interface LeadKanbanCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

const LeadKanbanCard: React.FC<LeadKanbanCardProps> = ({ lead, onClick }) => {
  return (
    <div className="kanban-card" onClick={() => onClick(lead)} style={{ backgroundColor: '#ffffff' }}>
      <div className="card-top">
        <h4 className="deal-name">{lead.name}</h4>
      </div>

      <div className="card-tags">
        <span className="id-tag">ID: {lead.id}</span>
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

      <div className="card-bottom" style={{ marginTop: '12px' }}>
        <div className="card-meta">
          <div className="meta-item" style={{ fontSize: '12px', color: '#64748b' }}>
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
}

const LeadKanbanColumn: React.FC<LeadKanbanColumnProps> = ({ title, count, leads, color, onCardClick }) => {
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
    <div className="kanban-column" style={{ height: 'calc(100vh - 220px)' }}>
      <div className="column-header" style={{ borderTopColor: color }}>
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
          <LeadKanbanCard key={lead.id} lead={lead} onClick={onCardClick} />
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
}

const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({ leads, onView }) => {
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
          />
        );
      })}
    </div>
  );
};

export default LeadKanbanBoard;

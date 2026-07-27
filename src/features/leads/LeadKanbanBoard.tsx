import React, { useState, useRef, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { Lead } from './LeadTable';
import '../kanban/KanbanColumn.css';
import '../kanban/KanbanCard.css';
import './LeadKanbanBoard.css';

const MOCK_ASSIGNEES = [
  { id: '1', name: 'Alice Smith', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=random' },
  { id: '2', name: 'Bob Johnson', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=random' },
  { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=random' },
];

interface LeadKanbanCardProps {
  lead: Lead;
  color: string;
  onClick: (lead: Lead) => void;
  onAssign: (lead: Lead, userId: string) => void;
}

const LeadKanbanCard: React.FC<LeadKanbanCardProps> = ({ lead, color, onClick, onAssign }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const assignedUsers = MOCK_ASSIGNEES.filter(u => {
    const currentAssigned = typeof lead.assigned_to === 'string' ? lead.assigned_to.split(',') : [];
    return currentAssigned.includes(u.id);
  });

  return (
    <div className="kanban-card" onClick={() => onClick(lead)} style={{ backgroundColor: `${color}08`, border: `1px solid ${color}30` }}>
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

      <div className="card-bottom" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div className="card-meta" style={{ flex: 1, minWidth: 0 }}>
          <div className="meta-item" style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            {lead.email}
          </div>
        </div>
        
        <div className="assignee-section" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }} ref={dropdownRef}>
          <div className="avatar-group" style={{ display: 'flex', alignItems: 'center' }}>
            {assignedUsers.map((user, index) => (
              <img 
                key={user.id}
                src={user.avatar} 
                alt={user.name} 
                className="stacked-avatar" 
                title={`Assigned to ${user.name}`}
                style={{ width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', border: '1.5px solid #fff', zIndex: assignedUsers.length - index, position: 'relative' }}
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              />
            ))}
          </div>

          <div 
            className="add-member-btn" 
            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            title="Assign someone"
            style={{ width: '24px', height: '24px', border: '1px dashed #cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', zIndex: 0 }}
          >
            <UserPlus size={12} />
          </div>

          {showDropdown && (
            <div className="assign-dropdown" style={{ 
              position: 'absolute', right: 0, top: '30px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '180px', zIndex: 9999, overflow: 'hidden'
            }}>
              <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                Assign Lead To
              </div>
              {MOCK_ASSIGNEES.map(user => {
                const isSelected = assignedUsers.some(u => u.id === user.id);
                return (
                  <div 
                    key={user.id} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer', fontSize: '12px', backgroundColor: isSelected ? '#f1f5f9' : 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#f1f5f9' : 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssign(lead, user.id);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={user.avatar} alt={user.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      <span>{user.name}</span>
                    </div>
                    {isSelected && <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
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
    <div className="kanban-column" style={{ height: 'calc(100vh - 220px)' }}>
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

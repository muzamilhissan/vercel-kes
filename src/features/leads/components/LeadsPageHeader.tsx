import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, X, LayoutGrid, List, Filter, Search } from 'lucide-react';
import { getLocalDateString, normalizeAssignee, getAssigneeAvatar } from '../utils';
import { LeadAssignee } from '../LeadTable';

interface LeadsPageHeaderProps {
  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  filterAssignees: string[];
  setFilterAssignees: (assignees: string[] | ((prev: string[]) => string[])) => void;
  assignableUsers?: any[];
  onAddLead: () => void;
}

const LeadsPageHeader: React.FC<LeadsPageHeaderProps> = ({
  viewMode,
  setViewMode,
  filterDate,
  setFilterDate,
  filterAssignees,
  setFilterAssignees,
  assignableUsers = [],
  onAddLead
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedAssignees: LeadAssignee[] = assignableUsers
    .map(normalizeAssignee)
    .filter(Boolean) as LeadAssignee[];

  const filteredAssignees = normalizedAssignees.filter(a => {
    const term = assigneeSearchQuery.toLowerCase();
    return (
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.fullName && a.fullName.toLowerCase().includes(term)) ||
      (a.email && a.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-header">
      <div className="page-header-title">
        <h2>Lead Management</h2>
        <p>Track and qualify your incoming sales opportunities.</p>
      </div>
      <div className="page-header-actions lead-header-actions">
        {normalizedAssignees.length > 0 && (
          <div className="filter-dropdown-container" ref={filterRef} style={{ position: 'relative', marginRight: '8px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontWeight: 500 }}
            >
              <Filter size={16} /> 
              <span>Filter</span>
              {filterAssignees.length > 0 && (
                <span style={{ background: '#70309f', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', marginLeft: '4px' }}>
                  {filterAssignees.length}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div className="filter-popover" style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '280px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="Search assignee"
                      value={assigneeSearchQuery}
                      onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '8px 0' }}>
                  {filteredAssignees.map(assignee => (
                    <label 
                      key={assignee.id} 
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', cursor: 'pointer', transition: 'background 0.15s', margin: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <input 
                        type="checkbox"
                        checked={filterAssignees.includes(String(assignee.id))}
                        onChange={() => {
                          const strId = String(assignee.id);
                          setFilterAssignees(prev => 
                            prev.includes(strId) 
                              ? prev.filter(id => id !== strId) 
                              : [...prev, strId]
                          );
                        }}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <img 
                        src={assignee.avatar || getAssigneeAvatar(assignee.name || assignee.fullName || 'User')} 
                        alt={assignee.name} 
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '13.5px', color: '#334155' }}>{assignee.fullName || assignee.name}</span>
                    </label>
                  ))}
                  {filteredAssignees.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      No assignees found
                    </div>
                  )}
                </div>

                <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => setFilterAssignees([])}
                    style={{ background: 'transparent', border: 'none', color: filterAssignees.length > 0 ? '#70309f' : '#94a3b8', cursor: filterAssignees.length > 0 ? 'pointer' : 'default', fontSize: '13px', fontWeight: 500, padding: 0 }}
                    disabled={filterAssignees.length === 0}
                  >
                    Clear
                  </button>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {filterAssignees.length > 0 ? `${filterAssignees.length} selected` : 'None selected'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="view-controls" style={{ marginRight: '16px' }}>
          <div className="view-toggle" style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
            <div 
              className={`toggle-item ${viewMode === 'kanban' ? 'active' : ''}`} 
              onClick={() => setViewMode('kanban')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: viewMode === 'kanban' ? '#ffffff' : 'transparent', boxShadow: viewMode === 'kanban' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', fontWeight: viewMode === 'kanban' ? 500 : 400 }}
            >
              <LayoutGrid size={16} />
              <span style={{ fontSize: '13px' }}>Board</span>
            </div>
            <div 
              className={`toggle-item ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: viewMode === 'list' ? '#ffffff' : 'transparent', boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', fontWeight: viewMode === 'list' ? 500 : 400 }}
            >
              <List size={16} />
              <span style={{ fontSize: '13px' }}>List</span>
            </div>
          </div>
        </div>

        <div className="date-filter-container">
          <div className={`date-filter-input-wrapper ${filterDate ? 'has-date' : ''}`}>
            <Calendar size={16} className="date-filter-calendar-icon" />
            <input 
              type="date" 
              value={filterDate} 
              onChange={e => setFilterDate(e.target.value)} 
              className="date-filter-input"
              max={getLocalDateString()}
            />
          </div>
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')} 
              className="date-filter-clear-btn"
              title="Clear filter"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button onClick={onAddLead} className={`btn-primary action-add-btn ${filterDate ? 'action-add-btn-collapsed' : ''}`}>
          <Plus size={16} /> <span className="action-add-btn-text">Add Lead</span>
        </button>
      </div>
    </div>
  );
};

export default LeadsPageHeader;

import React from 'react';
import { Plus, Calendar, X, LayoutGrid, List } from 'lucide-react';
import { getLocalDateString } from '../utils';

interface LeadsPageHeaderProps {
  viewMode: 'kanban' | 'list';
  setViewMode: (mode: 'kanban' | 'list') => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  onAddLead: () => void;
}

const LeadsPageHeader: React.FC<LeadsPageHeaderProps> = ({
  viewMode,
  setViewMode,
  filterDate,
  setFilterDate,
  onAddLead
}) => {
  return (
    <div className="page-header">
      <div className="page-header-title">
        <h2>Lead Management</h2>
        <p>Track and qualify your incoming sales opportunities.</p>
      </div>
      <div className="page-header-actions lead-header-actions">
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

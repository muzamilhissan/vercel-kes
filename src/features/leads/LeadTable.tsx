import React, { useState, useMemo } from 'react';
import { MoreVertical, Edit2, Trash2, UserPlus, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './LeadTable.css';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Proposed' | 'Qualified' | 'Disqualified' | 'Converted';
  dateAdded: string;
  industry?: string;
  province?: string;
  website?: string;
  source?: string;
  expected_revenue?: number;
  probability?: number;
  notes?: string;
}

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ 
  leads, 
  onEdit, 
  onDelete, 
  onConvert, 
  onView,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'company' | 'email' | 'phone' | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;

  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return leads;

    return [...leads].sort((a, b) => {
      const field = sortConfig.key!;
      const valA = (a[field] || '').toLowerCase();
      const valB = (b[field] || '').toLowerCase();

      if (sortConfig.direction === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  }, [leads, sortConfig]);

  const activePage = currentPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedLeads = sortedLeads;

  const handleSort = (key: 'name' | 'company' | 'email' | 'phone') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return { key: null, direction: 'asc' };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (activePage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }
      if (activePage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="lead-table-wrapper">
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('name')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Name</span>
                  {sortConfig.key !== 'name' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('company')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Company</span>
                  {sortConfig.key !== 'company' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('email')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Email</span>
                  {sortConfig.key !== 'email' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('phone')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Phone Number</span>
                  {sortConfig.key !== 'phone' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 500 }}>
                  No leads found. Click "Add Lead" to get started!
                </td>
              </tr>
            ) : (
              displayedLeads.map(lead => (
                <tr key={lead.id} onClick={() => onView(lead)} style={{ cursor: 'pointer' }} className="clickable-row">
                  <td>
                    <span className="lead-name-value">{lead.name}</span>
                  </td>
                  <td className="lead-company-value">{lead.company}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>
                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button className="action-btn" title="Edit Lead" onClick={() => onEdit(lead)}><Edit2 size={16} /></button>
                      <button className="action-btn" title="Delete Lead" style={{ color: '#ef4444' }} onClick={() => onDelete(lead)}><Trash2 size={16} /></button>
                      <button 
                        className="action-btn" 
                        title={lead.status === 'Converted' ? "Already Converted to Contact" : "Convert to Contact"} 
                        onClick={() => onConvert(lead)}
                        disabled={lead.status === 'Converted'}
                        style={lead.status !== 'Converted' ? { color: '#10b981' } : undefined}
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <span className="pagination-highlight">{startIndex + 1}</span> to{' '}
            <span className="pagination-highlight">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="pagination-highlight">{totalItems}</span> entries
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(Math.max(activePage - 1, 1))}
              disabled={activePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={`page-${page}`}
                  className={`pagination-btn ${activePage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="pagination-btn"
              onClick={() => onPageChange(Math.min(activePage + 1, totalPages))}
              disabled={activePage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;



import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import './LeadTable.css';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  dateAdded: string;
}

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onConvert }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

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
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Date added</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 500 }}>
                  No leads found. Click "Add Lead" to get started!
                </td>
              </tr>
            ) : (
              displayedLeads.map(lead => (
                <tr key={lead.id}>
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
                  <td style={{ color: '#64748b' }}>{lead.dateAdded}</td>
                  <td className="text-right">
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
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

      {leads.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <span className="pagination-highlight">{startIndex + 1}</span> to{' '}
            <span className="pagination-highlight">
              {Math.min(startIndex + itemsPerPage, leads.length)}
            </span>{' '}
            of <span className="pagination-highlight">{leads.length}</span> entries
          </div>
          {totalPages > 1 && (
            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(Number(page))}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadTable;


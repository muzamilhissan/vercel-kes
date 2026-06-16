import React, { useState, useMemo } from 'react';
import { MoreVertical, Edit2, Trash2, Mail, Phone, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import './ContactTable.css';
import { capitalize } from '../../utils/stringUtils';

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  accountId: string;
  accountName: string;
}

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onAccountClick: (accountId: string) => void;
  onView: (contact: Contact) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onEdit, onDelete, onAccountClick, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'jobTitle' | 'email' | 'phone' | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  const sortedContacts = useMemo(() => {
    if (!sortConfig.key) return contacts;
    return [...contacts].sort((a, b) => {
      const field = sortConfig.key!;
      const valA = a[field] || '';
      const valB = b[field] || '';
      return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [contacts, sortConfig]);

  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedContacts = sortedContacts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: 'name' | 'jobTitle' | 'email' | 'phone') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
    setCurrentPage(1);
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
    <div className="contact-table-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="sortable-header" onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Name
                  {sortConfig.key !== 'name' ? (
                    <ChevronUp size={14} className="sort-icon-inactive" />
                  ) : sortConfig.direction === 'asc' ? (
                    <ChevronUp size={14} className="sort-icon-active" />
                  ) : (
                    <ChevronDown size={14} className="sort-icon-active" />
                  )}
                </div>
              </th>
              <th className="sortable-header" onClick={() => handleSort('jobTitle')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Job Title
                  {sortConfig.key !== 'jobTitle' ? (
                    <ChevronUp size={14} className="sort-icon-inactive" />
                  ) : sortConfig.direction === 'asc' ? (
                    <ChevronUp size={14} className="sort-icon-active" />
                  ) : (
                    <ChevronDown size={14} className="sort-icon-active" />
                  )}
                </div>
              </th>
              <th>Account</th>
              <th className="sortable-header" onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Email
                  {sortConfig.key !== 'email' ? (
                    <ChevronUp size={14} className="sort-icon-inactive" />
                  ) : sortConfig.direction === 'asc' ? (
                    <ChevronUp size={14} className="sort-icon-active" />
                  ) : (
                    <ChevronDown size={14} className="sort-icon-active" />
                  )}
                </div>
              </th>
              <th className="sortable-header" onClick={() => handleSort('phone')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Phone
                  {sortConfig.key !== 'phone' ? (
                    <ChevronUp size={14} className="sort-icon-inactive" />
                  ) : sortConfig.direction === 'asc' ? (
                    <ChevronUp size={14} className="sort-icon-active" />
                  ) : (
                    <ChevronDown size={14} className="sort-icon-active" />
                  )}
                </div>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedContacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 500 }}>
                  No contacts found. Click "Add Contact" to get started!
                </td>
              </tr>
            ) : (
              displayedContacts.map(contact => {
                const displayName = capitalize(contact.name);
                const displayJobTitle = contact.jobTitle ? capitalize(contact.jobTitle) : 'N/A';
                
                return (
                  <tr key={contact.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{displayName}</span>
                    </td>
                    <td style={{ color: '#64748b' }}>{displayJobTitle}</td>
                    <td>
                      {contact.accountId ? (
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccountClick(contact.accountId);
                          }}
                          style={{ 
                            color: '#70309f', 
                            fontWeight: 600, 
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {contact.accountName}
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600, color: '#64748b' }}>
                          {contact.accountName}
                        </span>
                      )}
                    </td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td className="text-center">
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button className="action-btn" title="View Contact Details" onClick={() => onView(contact)}><Eye size={16} /></button>
                        <button className="action-btn" title="Edit Contact" onClick={() => onEdit(contact)}><Edit2 size={16} /></button>
                        <button className="action-btn" title="Delete Contact" style={{ color: '#ef4444' }} onClick={() => onDelete(contact)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <span className="pagination-highlight">{startIndex + 1}</span> to{' '}
            <span className="pagination-highlight">
              {Math.min(startIndex + itemsPerPage, contacts.length)}
            </span>{' '}
            of <span className="pagination-highlight">{contacts.length}</span> entries
          </div>
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
        </div>
      )}
    </div>
  );
};

export default ContactTable;


import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Account } from '../../api/types';
import { capitalize } from '../../utils/stringUtils';
import './AccountTable.css';

interface AccountTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onView: (account: Account) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({ 
  accounts, 
  onEdit, 
  onDelete, 
  onView,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'industry' | 'website' | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;

  const sortedAccounts = useMemo(() => {
    if (!sortConfig.key) return accounts;

    return [...accounts].sort((a, b) => {
      const field = sortConfig.key!;
      const valA = (a[field] || '').toLowerCase();
      const valB = (b[field] || '').toLowerCase();

      if (sortConfig.direction === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  }, [accounts, sortConfig]);

  const activePage = currentPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedAccounts = sortedAccounts;

  const handleSort = (key: 'name' | 'industry' | 'website') => {
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
                  <span>Company Name</span>
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
                onClick={() => handleSort('industry')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Industry</span>
                  {sortConfig.key !== 'industry' ? (
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
                onClick={() => handleSort('website')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Website</span>
                  {sortConfig.key !== 'website' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAccounts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 500 }}>
                  No accounts found. Click "New Account" to get started!
                </td>
              </tr>
            ) : (
              displayedAccounts.map(account => (
                <tr key={account.id} onClick={() => onView(account)} style={{ cursor: 'pointer' }} className="clickable-row">
                  <td>
                    <span style={{ fontWeight: 600 }}>{capitalize(account.name)}</span>
                  </td>
                  <td style={{ color: '#64748b' }}>{capitalize(account.industry)}</td>
                  <td>
                    {account.website ? (
                      <a 
                        href={account.website.startsWith('http') ? account.website : `https://${account.website}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: '#70309f', textDecoration: 'none', fontWeight: 600 }} 
                        onClick={e => e.stopPropagation()}
                      >
                        {account.website.replace(/^https?:\/\/(www\.)?/i, '')}
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>-</span>
                    )}
                  </td>
                  <td className="text-center" onClick={e => e.stopPropagation()}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button className="action-btn" title="Edit Account" onClick={() => onEdit(account)}><Edit2 size={16} /></button>
                      <button className="action-btn" title="Delete Account" style={{ color: '#ef4444' }} onClick={() => onDelete(account)}><Trash2 size={16} /></button>
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

export default AccountTable;

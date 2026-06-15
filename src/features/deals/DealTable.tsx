import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './DealTable.css';

export interface FrontendDeal {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  value: number;
  closeDate: string;
  stage: string;
  notes: string;
}

interface DealTableProps {
  deals: FrontendDeal[];
  onEdit: (deal: FrontendDeal) => void;
  onDelete: (deal: FrontendDeal) => void;
}

const DealTable: React.FC<DealTableProps> = ({ deals, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'accountName' | 'value' | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;

  const sortedDeals = useMemo(() => {
    if (!sortConfig.key) return deals;

    return [...deals].sort((a, b) => {
      const field = sortConfig.key!;
      if (field === 'value') {
        const valA = a.value || 0;
        const valB = b.value || 0;
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      } else {
        const valA = (a[field] || '').toLowerCase();
        const valB = (b[field] || '').toLowerCase();
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    });
  }, [deals, sortConfig]);

  const totalPages = Math.ceil(sortedDeals.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedDeals = sortedDeals.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: 'name' | 'accountName' | 'value') => {
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStageClass = (stage: string) => {
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('won') || stageLower.includes('done')) return 'status-qualified';
    if (stageLower.includes('progress') || stageLower.includes('process')) return 'status-contacted';
    if (stageLower.includes('new') || stageLower.includes('to do')) return 'status-new';
    return 'status-converted';
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
                  <span>Deal Name</span>
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
                onClick={() => handleSort('accountName')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Linked Account</span>
                  {sortConfig.key !== 'accountName' ? (
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
                onClick={() => handleSort('value')} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Value</span>
                  {sortConfig.key !== 'value' ? (
                    <ArrowUpDown size={14} style={{ opacity: 0.6 }} />
                  ) : sortConfig.direction === 'asc' ? (
                    <ArrowUp size={14} style={{ color: '#ffffff' }} />
                  ) : (
                    <ArrowDown size={14} style={{ color: '#ffffff' }} />
                  )}
                </div>
              </th>
              <th>Close Date</th>
              <th>Stage</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedDeals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontWeight: 500 }}>
                  No deals found. Click "Add Deal" to get started!
                </td>
              </tr>
            ) : (
              displayedDeals.map(deal => (
                <tr key={deal.id}>
                  <td>
                    <span className="lead-name-value">{deal.name}</span>
                  </td>
                  <td className="lead-company-value">{deal.accountName}</td>
                  <td style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(deal.value)}</td>
                  <td style={{ color: '#64748b' }}>{deal.closeDate}</td>
                  <td>
                    <span className={`status-badge ${getStageClass(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button className="action-btn" title="Edit Deal" onClick={() => onEdit(deal)}><Edit2 size={16} /></button>
                      <button className="action-btn" title="Delete Deal" style={{ color: '#ef4444' }} onClick={() => onDelete(deal)}><Trash2 size={16} /></button>
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
              {Math.min(startIndex + itemsPerPage, deals.length)}
            </span>{' '}
            of <span className="pagination-highlight">{deals.length}</span> entries
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

export default DealTable;

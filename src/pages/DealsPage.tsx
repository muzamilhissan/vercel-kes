import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import DealTable, { FrontendDeal } from '../features/deals/DealTable';
import DealModal from '../features/deals/DealModal';
import DealDetailsModal from '../features/deals/DealDetailsModal';
import DeleteModal from '../features/leads/DeleteModal';
import { Plus } from 'lucide-react';
import { dealService } from '../api/dealService';
import { accountService } from '../api/accountService';
import { useToast } from '../context/ToastContext';
import { Account, Deal } from '../api/types';

const formatDateString = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const DealsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const { showToast } = useToast();
  const [deals, setDeals] = useState<FrontendDeal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<FrontendDeal | null>(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingDeal, setIsDeletingDeal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchDealsAndAccounts = async (page?: number | any, query?: string) => {
    const pageNum = typeof page === 'number' ? page : currentPage;
    const queryStr = typeof query === 'string' ? query : searchQuery;
    try {
      setLoading(true);
      setError(null);
      
      // Load accounts first for lookup mapping (load all using high limit)
      const accountsRes = await accountService.list(1, 10) as any;
      let accountsList: Account[] = [];
      if (accountsRes.success) {
        const apiAccounts = accountsRes.accounts || accountsRes.data?.accounts || accountsRes.data;
        if (Array.isArray(apiAccounts)) {
          accountsList = apiAccounts;
          setAccounts(accountsList);
        }
      }

      // Load deals
      const dealsRes = await dealService.list(pageNum, 10, queryStr) as any;
      if (dealsRes.success) {
        const apiDeals = dealsRes.deals || dealsRes.data?.deals || dealsRes.data;
        if (Array.isArray(apiDeals)) {
          const mappedDeals: FrontendDeal[] = apiDeals.map(d => {
            const acc = accountsList.find(a => String(a.id) === String(d.account_id));
            return {
              id: String(d.id),
              name: d.name || '',
              accountId: String(d.account_id || ''),
              accountName: acc ? acc.name : 'Unknown Account',
              value: Number(d.value || 0),
              closeDate: formatDateString(d.close_date),
              stage: d.stage || 'New',
              notes: d.notes || ''
            };
          });
          setDeals(mappedDeals);
          if (dealsRes.meta) {
            setTotalPages(dealsRes.meta.last_page || 1);
            setTotalItems(dealsRes.meta.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(apiDeals.length);
          }
          window.dispatchEvent(new CustomEvent('dealsUpdated'));
        } else {
          setDeals([]);
          setTotalPages(1);
          setTotalItems(0);
          window.dispatchEvent(new CustomEvent('dealsUpdated'));
        }
      } else {
        setDeals([]);
        setTotalPages(1);
        setTotalItems(0);
        window.dispatchEvent(new CustomEvent('dealsUpdated'));
      }
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchDealsAndAccounts(1, searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDealsAndAccounts(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.query === 'string') {
        setSearchQuery(customEvent.detail.query);
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch);
    };
  }, []);

  const filteredDeals = deals;

  const handleAccountClick = (accountId: string) => {
    localStorage.setItem('autoOpenAccountDetailsId', accountId);
    onNavigate('accounts');
  };

  const handleSaveDeal = async (dealData: Omit<FrontendDeal, 'accountName'>) => {
    try {
      setError(null);
      
      const payload = {
        name: dealData.name,
        account_id: dealData.accountId,
        value: dealData.value,
        close_date: dealData.closeDate,
        stage: dealData.stage,
        notes: dealData.notes
      };

      if (selectedDeal) {
        // Edit flow
        const res = await dealService.update(selectedDeal.id, payload);
        if (res.success) {
          await fetchDealsAndAccounts();
          showToast('Deal updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update deal', 'error');
        }
      } else {
        // Create flow
        const res = await dealService.store(payload);
        if (res.success) {
          await fetchDealsAndAccounts();
          showToast('Deal created successfully', 'success');
        } else {
          showToast(res.message || 'Failed to create deal', 'error');
        }
      }
      setIsDealModalOpen(false);
    } catch (err: any) {
      console.error('Error saving deal:', err);
      showToast(err.message || 'Error saving deal', 'error');
    }
  };

  const handleDeleteDeal = async () => {
    if (!selectedDeal) return;
    try {
      setIsDeletingDeal(true);
      setError(null);
      const res = await dealService.delete(selectedDeal.id);
      if (res.success) {
        await fetchDealsAndAccounts();
        showToast('Deal deleted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to delete deal', 'error');
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting deal:', err);
      showToast(err.message || 'Error deleting deal', 'error');
    } finally {
      setIsDeletingDeal(false);
    }
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Deal Management</h2>
          <p>Track business opportunities, stages, and projected values.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={() => { setSelectedDeal(null); setIsDealModalOpen(true); }} className="btn-primary">
            <Plus size={16} /> <span>Add Deal</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #70309f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading deals...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fecaca', margin: '24px 0', padding: '24px' }}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
          <button className="btn-primary" onClick={fetchDealsAndAccounts}>Try Again</button>
        </div>
      ) : (
        <DealTable 
          deals={filteredDeals} 
          onView={(d) => { setSelectedDeal(d); setIsViewModalOpen(true); }}
          onEdit={(d) => { setSelectedDeal(d); setIsDealModalOpen(true); }} 
          onDelete={(d) => { setSelectedDeal(d); setIsDeleteModalOpen(true); }} 
          onAccountClick={handleAccountClick}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      )}

      <DealModal 
        isOpen={isDealModalOpen} 
        onClose={() => setIsDealModalOpen(false)} 
        onSave={handleSaveDeal} 
        initialData={selectedDeal} 
      />
      
      <DealDetailsModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        deal={selectedDeal} 
        onAccountClick={handleAccountClick}
      />
      
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeletingDeal && setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteDeal} 
        itemName={selectedDeal?.name || ''} 
        isDeleting={isDeletingDeal} 
      />
    </MainLayout>
  );
};

export default DealsPage;

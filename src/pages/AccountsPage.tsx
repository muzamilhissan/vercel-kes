import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import AccountTable from '../features/accounts/AccountTable';
import Loader from '../components/ui/Loader';
import AccountModal from '../features/accounts/AccountModal';
import AccountDetails from '../features/accounts/AccountDetails';
import DeleteModal from '../features/accounts/DeleteModal';
import { Building, Plus } from 'lucide-react';
import { accountService } from '../api/accountService';
import { useToast } from '../context/ToastContext';
import { Account } from '../api/types';
import { capitalize } from '../utils/stringUtils';

const AccountsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.query === 'string') {
        setSearchQuery(customEvent.detail.query);
        setCurrentPage(1);
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch);
    };
  }, []);

  const fetchAccounts = async (page?: number | any, query?: string) => {
    const pageNum = typeof page === 'number' ? page : currentPage;
    const queryStr = typeof query === 'string' ? query : searchQuery;
    try {
      setLoading(true);
      setError(null);
      const res = await accountService.list(pageNum, 10, queryStr) as any;
      if (res.success) {
        const apiAccounts = res.accounts || res.data?.accounts || res.data;
        if (Array.isArray(apiAccounts)) {
          setAccounts(apiAccounts);
          if (res.meta) {
            setTotalPages(res.meta.last_page || 1);
            setTotalItems(res.meta.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(apiAccounts.length);
          }
          window.dispatchEvent(new CustomEvent('accountsUpdated'));
        } else {
          setAccounts([]);
          setTotalPages(1);
          setTotalItems(0);
          window.dispatchEvent(new CustomEvent('accountsUpdated'));
        }
      } else {
        setError(res.message || 'Failed to fetch accounts');
      }
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    if (!loading && accounts.length > 0) {
      const autoOpenId = localStorage.getItem('autoOpenAccountDetailsId');
      if (autoOpenId) {
        const account = accounts.find(a => String(a.id) === String(autoOpenId));
        if (account) {
          setSelectedAccount(account);
          setIsDetailsOpen(true);
        }
        localStorage.removeItem('autoOpenAccountDetailsId');
      }
    }
  }, [accounts, loading]);

  const handleSaveAccount = async (accountData: Account) => {
    try {
      let formattedWebsite = accountData.website ? accountData.website.trim() : '';
      if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      const capitalizedName = capitalize(accountData.name);
      const capitalizedIndustry = capitalize(accountData.industry);

      if (selectedAccount) {
        // Edit flow
        const payload = {
          name: capitalizedName,
          industry: capitalizedIndustry,
          website: formattedWebsite,
          description: accountData.description,
        };
        const res = await accountService.update(selectedAccount.id, payload);
        if (res.success) {
          await fetchAccounts();
          showToast('Account updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update account', 'error');
        }
      } else {
        // Create flow
        const payload = {
          name: capitalizedName,
          industry: capitalizedIndustry,
          website: formattedWebsite,
          description: accountData.description,
        };
        const res = await accountService.store(payload);
        if (res.success) {
          await fetchAccounts();
          showToast('Account created successfully', 'success');
        } else {
          showToast(res.message || 'Failed to create account', 'error');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving account:', err);
      showToast(err.message || 'Error saving account', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    setIsDeleting(true);
    try {
      const res = await accountService.delete(selectedAccount.id);
      if (res.success) {
        await fetchAccounts();
        showToast('Account deleted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to delete account', 'error');
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting account:', err);
      showToast(err.message || 'Error deleting account', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAccounts = accounts;

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Accounts</h2>
          <p>Manage company records and their related contacts and deals.</p>
        </div>
        <div className="page-header-actions">
          <button 
            onClick={() => { setSelectedAccount(null); setIsModalOpen(true); }} 
            className="btn-primary"
          >
            <Plus size={16} /> 
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading company accounts..." />
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fecaca', margin: '24px 0', padding: '24px' }}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
          <button className="btn-primary" onClick={fetchAccounts}>Try Again</button>
        </div>
      ) : (
        <AccountTable 
          accounts={filteredAccounts} 
          onEdit={(a) => { setSelectedAccount(a); setIsModalOpen(true); }} 
          onDelete={(a) => { setSelectedAccount(a); setIsDeleteModalOpen(true); }} 
          onView={(a) => { setSelectedAccount(a); setIsDetailsOpen(true); }} 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      )}

      <AccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAccount} 
        initialData={selectedAccount} 
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteAccount} 
        itemName={selectedAccount?.name || ''} 
        isDeleting={isDeleting} 
      />

      {selectedAccount && (
        <AccountDetails 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          account={selectedAccount} 
        />
      )}
    </MainLayout>
  );
};

export default AccountsPage;

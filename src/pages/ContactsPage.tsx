import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ContactTable, { Contact } from '../features/contacts/ContactTable';
import ContactModal from '../features/contacts/ContactModal';
import ContactDetailsModal from '../features/contacts/ContactDetailsModal';
import DeleteModal from '../features/leads/DeleteModal';
import { Plus } from 'lucide-react';
import { contactService } from '../api/contactService';
import { accountService } from '../api/accountService';
import { useToast } from '../context/ToastContext';

const mapApiContactToFrontendContact = (apiContact: any): Contact => {
  return {
    id: String(apiContact.id),
    name: apiContact.name || '',
    jobTitle: apiContact.job_title || '',
    email: apiContact.email || '',
    phone: apiContact.phone || '',
    accountId: apiContact.account_id ? String(apiContact.account_id) : '',
    accountName: apiContact.account?.name || 'No Account',
  };
};

const ContactsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<{id: string, name: string}[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
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

  const filteredContacts = contacts;

  // Load accounts list once on mount (only for dropdown in modal)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsRes = await accountService.list(1, 100) as any;
        if (accountsRes.success) {
          const apiAccounts = accountsRes.accounts || accountsRes.data?.accounts || accountsRes.data;
          if (Array.isArray(apiAccounts)) {
            setAccounts(apiAccounts.map(a => ({ id: String(a.id), name: a.name })));
          }
        }
      } catch (err) {
        console.error('Failed to load accounts in ContactsPage:', err);
      }
    };
    fetchAccounts();
  }, []);

  const fetchData = async (page?: number | any, query?: string) => {
    const pageNum = typeof page === 'number' ? page : currentPage;
    const queryStr = typeof query === 'string' ? query : searchQuery;
    try {
      setLoading(true);
      setError(null);
      
      const contactsRes = await contactService.list(pageNum, 10, queryStr) as any;

      if (contactsRes.success) {
        const apiContacts = contactsRes.contacts || contactsRes.data?.contacts || contactsRes.data;
        if (Array.isArray(apiContacts)) {
          setContacts(apiContacts.map(mapApiContactToFrontendContact));
          if (contactsRes.meta) {
            setTotalPages(contactsRes.meta.last_page || 1);
            setTotalItems(contactsRes.meta.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(apiContacts.length);
          }
          window.dispatchEvent(new CustomEvent('contactsUpdated'));
        } else {
          setContacts([]);
          setTotalPages(1);
          setTotalItems(0);
          window.dispatchEvent(new CustomEvent('contactsUpdated'));
        }
      } else {
        setError(contactsRes.message || 'Failed to fetch contacts');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSave = async (contactData: Contact) => {
    try {
      setError(null);
      if (selectedContact) {
        // Edit
        const payload = {
          name: contactData.name,
          job_title: contactData.jobTitle,
          email: contactData.email,
          phone: contactData.phone,
          account_id: contactData.accountId
        };
        const res = await contactService.update(selectedContact.id, payload);
        if (res.success) {
          await fetchData();
          showToast('Contact updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update contact', 'error');
        }
      } else {
        // Create
        const payload = {
          name: contactData.name,
          job_title: contactData.jobTitle,
          email: contactData.email,
          phone: contactData.phone,
          account_id: contactData.accountId
        };
        const res = await contactService.store(payload);
        if (res.success) {
          await fetchData();
          showToast('Contact created successfully', 'success');
        } else {
          showToast(res.message || 'Failed to create contact', 'error');
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving contact:', err);
      showToast(err.message || 'Error saving contact', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      setIsDeleting(true);
      setError(null);
      const res = await contactService.delete(selectedContact.id);
      if (res.success) {
        await fetchData();
        showToast('Contact deleted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to delete contact', 'error');
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      showToast(err.message || 'Error deleting contact', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAccountClick = (accountId: string) => {
    localStorage.setItem('autoOpenAccountDetailsId', accountId);
    onNavigate('accounts');
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Contacts</h2>
          <p>Manage individual people and their business relationships.</p>
        </div>
        <div className="page-header-actions">
          <button 
            onClick={() => { setSelectedContact(null); setIsModalOpen(true); }} 
            className="btn-primary"
          >
            <Plus size={16} /> 
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #70309f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading contacts...</p>
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
          <button className="btn-primary" onClick={fetchData}>Try Again</button>
        </div>
      ) : (
        <ContactTable 
          contacts={filteredContacts} 
          onEdit={(c) => { setSelectedContact(c); setIsModalOpen(true); }} 
          onDelete={(c) => { setSelectedContact(c); setIsDeleteModalOpen(true); }} 
          onAccountClick={handleAccountClick}
          onView={(c) => { setSelectedContact(c); setIsDetailsOpen(true); }}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      )}

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedContact} accounts={accounts} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)} onConfirm={handleDelete} itemName={selectedContact?.name || ''} isDeleting={isDeleting} />
      <ContactDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} contact={selectedContact} />
    </MainLayout>
  );
};

export default ContactsPage;

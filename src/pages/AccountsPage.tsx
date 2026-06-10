import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import AccountTable, { Account } from '../features/accounts/AccountTable';
import AccountModal from '../features/accounts/AccountModal';
import AccountDetails from '../features/accounts/AccountDetails';
import { Building2, Plus } from 'lucide-react';

const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Global Tech', industry: 'Engineering', website: 'globaltech.com', description: 'Leading provider of engineering solutions.' },
  { id: '2', name: 'Kudon Engineering', industry: 'Construction', website: 'kudon.com', description: 'Excellence in structural engineering.' }
];

const AccountsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
            <Building2 size={18} /> 
            <span>New Account</span>
          </button>
        </div>
      </div>
      <AccountTable accounts={accounts} onEdit={(a) => { setSelectedAccount(a); setIsModalOpen(true); }} onDelete={(a) => setAccounts(accounts.filter(i => i.id !== a.id))} onView={(a) => { setSelectedAccount(a); setIsDetailsOpen(true); }} />
      <AccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(a) => selectedAccount ? setAccounts(accounts.map(i => i.id === a.id ? a : i)) : setAccounts([...accounts, a])} initialData={selectedAccount} />
      {selectedAccount && <AccountDetails isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} account={selectedAccount} linkedContacts={[]} linkedDeals={[]} />}
    </MainLayout>
  );
};

export default AccountsPage;

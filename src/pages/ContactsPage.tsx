import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ContactTable, { Contact } from '../features/contacts/ContactTable';
import ContactModal from '../features/contacts/ContactModal';
import { UserPlus, Filter } from 'lucide-react';

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Global Tech' },
  { id: '2', name: 'Kudon Engineering' }
];

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Walker', jobTitle: 'Chief Engineer', email: 'alice@globaltech.com', phone: '+1 555-0100', accountId: '1', accountName: 'Global Tech' },
  { id: '2', name: 'Bob Stevens', jobTitle: 'Project Manager', email: 'bob@kudon.com', phone: '+1 555-0200', accountId: '2', accountName: 'Kudon Engineering' }
];

const ContactsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (contact: Contact) => {
    if (selectedContact) setContacts(contacts.map(c => c.id === contact.id ? contact : c));
    else setContacts([...contacts, contact]);
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
            <UserPlus size={18} /> 
            <span>New Contact</span>
          </button>
        </div>
      </div>
      <ContactTable contacts={contacts} onEdit={(c) => { setSelectedContact(c); setIsModalOpen(true); }} onDelete={(c) => setContacts(contacts.filter(item => item.id !== c.id))} />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedContact} accounts={MOCK_ACCOUNTS} />
    </MainLayout>
  );
};

export default ContactsPage;

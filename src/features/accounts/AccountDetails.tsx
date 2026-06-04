import React from 'react';
import { X, Users, Briefcase, Info } from 'lucide-react';
import { Account } from './AccountTable';
import './AccountDetails.css';

interface AccountDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  linkedContacts: any[];
  linkedDeals: any[];
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ isOpen, onClose, account, linkedContacts, linkedDeals }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="details-modal-content large">
        <div className="details-header">
          <div><h2>{account.name}</h2><p>{account.industry} • {account.website}</p></div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="details-body scrollable">
          <section className="details-section">
            <div className="section-title"><Info size={18} /> <h3>About Company</h3></div>
            <p className="description">{account.description || 'No description available.'}</p>
          </section>
          <div className="details-grid">
            <section className="details-section">
              <div className="section-title"><Users size={18} /> <h3>Linked Contacts ({linkedContacts.length})</h3></div>
              <div className="linked-list">
                {linkedContacts.map(c => <div key={c.id} className="linked-item"><strong>{c.name}</strong><span>{c.jobTitle}</span></div>)}
              </div>
            </section>
            <section className="details-section">
              <div className="section-title"><Briefcase size={18} /> <h3>Related Deals ({linkedDeals.length})</h3></div>
              <div className="linked-list">
                {linkedDeals.map(d => <div key={d.id} className="linked-item"><strong>{d.name}</strong><span>${d.value.toLocaleString()} • {d.stage}</span></div>)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;

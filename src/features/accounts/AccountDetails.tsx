import React, { useState, useEffect } from 'react';
import { X, Users, Briefcase, Info } from 'lucide-react';
import { Account, Contact, Deal } from '../../api/types';
import { contactService } from '../../api/contactService';
import { dealService } from '../../api/dealService';
import { capitalize } from '../../utils/stringUtils';
import './AccountDetails.css';

interface AccountDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  linkedContacts?: any[];
  linkedDeals?: any[];
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ isOpen, onClose, account }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && account?.id) {
      const fetchLinkedData = async () => {
        setLoading(true);
        try {
          const [contactsRes, dealsRes] = await Promise.all([
            contactService.list(),
            dealService.list()
          ]);
          
          if (contactsRes.success && Array.isArray(contactsRes.data)) {
            const filteredContacts = contactsRes.data.filter(
              c => String(c.account_id) === String(account.id)
            );
            setContacts(filteredContacts);
          }
          
          if (dealsRes.success && Array.isArray(dealsRes.data)) {
            const filteredDeals = dealsRes.data.filter(
              d => String(d.account_id) === String(account.id)
            );
            setDeals(filteredDeals);
          }
        } catch (err) {
          console.error('Failed to load linked account data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchLinkedData();
    }
  }, [isOpen, account?.id]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="details-modal-content large" onClick={e => e.stopPropagation()}>
        <div className="details-header">
          <div>
            <h2>View Details</h2>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="details-body scrollable">
          <section className="details-section">
            <div className="section-title"><Info size={18} /> <h3>About company</h3></div>
            <div className="company-meta-info">
              <div className="meta-field"><strong>Company Name:</strong> {capitalize(account.name)}</div>
              <div className="meta-field"><strong>Industry:</strong> {capitalize(account.industry)}</div>
              <div className="meta-field"><strong>Website:</strong> {account.website ? (
                <a 
                  href={account.website.startsWith('http') ? account.website : `https://${account.website}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  {account.website}
                </a>
              ) : '-'}</div>
            </div>
            <p className="description">{account.description || 'No description available.'}</p>
          </section>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #70309f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div className="details-grid">
              <section className="details-section">
                <div className="section-title"><Users size={18} /> <h3>Linked contacts ({contacts.length})</h3></div>
                <div className="linked-list">
                  {contacts.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No linked contacts found.</span>
                  ) : (
                    contacts.map(c => (
                      <div key={c.id} className="linked-item">
                        <strong>{c.name}</strong>
                        <span>{c.job_title} • {c.email}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
              <section className="details-section">
                <div className="section-title"><Briefcase size={18} /> <h3>Related deals ({deals.length})</h3></div>
                <div className="linked-list">
                  {deals.length === 0 ? (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>No related deals found.</span>
                  ) : (
                    deals.map(d => (
                      <div key={d.id} className="linked-item">
                        <strong>{d.name}</strong>
                        <span>${d.value.toLocaleString()} • {d.stage}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;

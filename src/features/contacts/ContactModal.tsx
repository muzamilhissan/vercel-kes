import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Contact } from './ContactTable';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialData?: Contact | null;
  accounts: { id: string, name: string }[];
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, initialData, accounts }) => {
  const [formData, setFormData] = useState<Partial<Contact>>({ name: '', jobTitle: '', email: '', phone: '', accountId: '' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', jobTitle: '', email: '', phone: '', accountId: '' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{initialData ? 'Edit Contact' : 'New Contact'}</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, id: initialData?.id || Math.random().toString(36).substr(2, 9), accountName: accounts.find(a => a.id === formData.accountId)?.name || ''} as Contact); onClose(); }}>
          <div className="modal-body">
            <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group"><label>Job Title</label><input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label>Account</label>
              <select value={formData.accountId} onChange={e => setFormData({...formData, accountId: e.target.value})} required>
                <option value="">Select Account</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" className="btn-premium-primary">Save Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;

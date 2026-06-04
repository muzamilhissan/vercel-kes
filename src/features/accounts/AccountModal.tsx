import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Account } from './AccountTable';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  initialData?: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Account>>({ name: '', industry: '', website: '', description: '' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', industry: '', website: '', description: '' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{initialData ? 'Edit Account' : 'New Account'}</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, id: initialData?.id || Math.random().toString(36).substr(2, 9)} as Account); onClose(); }}>
          <div className="modal-body">
            <div className="form-group"><label>Company Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="form-group"><label>Industry</label><input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} required /></div>
              <div className="form-group"><label>Website</label><input type="text" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} /></div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" className="btn-premium-primary">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Account } from '../../api/types';
import './AccountModal.css';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => Promise<void>;
  initialData?: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Account>>({ name: '', industry: '', website: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [websiteError, setWebsiteError] = useState<string | null>(null);

  useEffect(() => {
    setWebsiteError(null);
    if (initialData) {
      const strippedWebsite = initialData.website ? initialData.website.replace(/^https?:\/\//i, '') : '';
      setFormData({
        ...initialData,
        website: strippedWebsite
      });
    } else {
      setFormData({ name: '', industry: '', website: '', description: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!formData.website || !urlPattern.test(formData.website.trim())) {
      setWebsiteError('Please enter a valid website URL (e.g. example.com)');
      setIsSaving(false);
      return;
    }
    setWebsiteError(null);

    try {
      await onSave({
        ...formData,
        id: initialData?.id || ''
      } as Account);
    } catch (err) {
      console.error('Error saving account:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Account' : 'New Account'}</h3>
          <button onClick={onClose} disabled={isSaving}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="lead-form-row-2">
              <div className="form-group">
                <label>Company Name <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter name"
                  required 
                  disabled={isSaving}
                  maxLength={150}
                />
              </div>
              <div className="form-group">
                <label>Industry <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.industry || ''} 
                  onChange={e => setFormData({...formData, industry: e.target.value})} 
                  placeholder="e.g. Technology"
                  required 
                  disabled={isSaving}
                  maxLength={150}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Website <span className="required-asterisk">*</span></label>
              <div className="website-input-wrapper">
                <span className="website-prefix">https://</span>
                <input 
                  type="text" 
                  value={formData.website || ''} 
                  onChange={e => {
                    const val = e.target.value.replace(/^https?:\/\//i, '');
                    setFormData({...formData, website: val});
                    if (websiteError) setWebsiteError(null);
                  }} 
                  placeholder="e.g. google.com"
                  required 
                  disabled={isSaving}
                />
              </div>
              {websiteError && (
                <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
                  {websiteError}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Enter description..."
                rows={3} 
                disabled={isSaving}
                maxLength={1000}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>
                <span>{(formData.description || '').length}/1000</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary" disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-premium-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;

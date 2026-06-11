import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Lead } from './LeadTable';
import './LeadModal.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void>;
  initialData?: Lead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', company: '', email: '', phone: '', status: 'New' });
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleValidate = (): boolean => {
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    }
    const isValid = isValidPhoneNumber(phoneNumber);
    if (!isValid) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  useEffect(() => {
    setPhoneError('');
    if (initialData) {
      setFormData(initialData);
      setPhoneNumber(initialData.phone || '');
    } else {
      setFormData({ name: '', company: '', email: '', phone: '', status: 'New' });
      setPhoneNumber('');
    }
  }, [initialData, isOpen]);

  const handlePhoneChange = (val: string | undefined) => {
    setPhoneNumber(val);
    setFormData(prev => ({ ...prev, phone: val || '' }));
    
    // Live validation check with smart length threshold to avoid annoying errors while typing
    if (!val) {
      setPhoneError('Phone number is required');
    } else {
      const isValid = isValidPhoneNumber(val);
      if (isValid) {
        setPhoneError('');
      } else if (val.length > 8) {
        setPhoneError('Please enter a valid phone number');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhoneValid = handleValidate();
    if (!isPhoneValid) return;
    
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        dateAdded: initialData?.dateAdded || new Date().toLocaleDateString()
      } as Lead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isSaving ? undefined : onClose}>
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Lead' : 'Create New'}</h3>
          <button onClick={onClose} disabled={isSaving}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row 1: Three fields (Lead Name, Company, Status) */}
            <div className="lead-form-row-3">
              <div className="form-group">
                <label>Lead Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  maxLength={150} 
                  placeholder="Enter name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                  maxLength={150} 
                  placeholder="Enter company name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  disabled={initialData?.status === 'Converted' || initialData?.status === 'Qualified'}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  {formData.status === 'Converted' && (
                    <option value="Converted">Converted</option>
                  )}
                </select>
              </div>
            </div>
            
            {/* Row 2: Two fields (Phone, Email) */}
            <div className="lead-form-row-2">
              <div className="form-group">
                <label>Phone</label>
                <PhoneInput
                  international
                  withCountryCallingCode
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="ZA"
                  className={phoneError ? 'invalid' : ''}
                  onBlur={handleValidate}
                  required
                />
                {phoneError && (
                  <div className="phone-error-message">
                    <span>⚠️</span> {phoneError}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="Enter email address"
                  required 
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary" disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-premium-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Contact } from './ContactTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialData?: Contact | null;
  accounts: { id: string, name: string }[];
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, initialData, accounts }) => {
  const [formData, setFormData] = useState<Partial<Contact>>({ name: '', jobTitle: '', email: '', phone: '', accountId: '' });
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');

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
      setFormData({ name: '', jobTitle: '', email: '', phone: '', accountId: '' });
      setPhoneNumber('');
    }
  }, [initialData, isOpen]);

  const handlePhoneChange = (val: string | undefined) => {
    setPhoneNumber(val);
    setFormData(prev => ({ ...prev, phone: val || '' }));
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPhoneValid = handleValidate();
    if (!isPhoneValid) return;

    onSave({
      ...formData, 
      id: initialData?.id || Math.random().toString(36).substr(2, 9), 
      accountName: accounts.find(a => a.id === formData.accountId)?.name || ''
    } as Contact);
  };

  const accountOptions = accounts.map(a => ({ value: a.id, label: a.name }));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content contact-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Contact' : 'Create New'}</h3>
          <button type="button" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="contact-form-row-3">
              <div className="form-group">
                <label>Full Name <span className="required-asterisk">*</span></label>
                <input type="text" placeholder="Enter full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} maxLength={150} required />
              </div>
              <div className="form-group">
                <label>Job Title <span className="required-asterisk">*</span></label>
                <input type="text" placeholder="Enter job title" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} maxLength={150} required />
              </div>
              <div className="form-group">
                <label>Account <span className="required-asterisk">*</span></label>
                <SearchableSelect
                  options={accountOptions}
                  value={formData.accountId || ''}
                  onChange={val => setFormData({...formData, accountId: val})}
                  placeholder="Select Account"
                  required
                  variant="compact"
                  placement="bottom"
                />
              </div>
            </div>
            
            <div className="contact-form-row-2">
              <div className="form-group">
                <label>Phone <span className="required-asterisk">*</span></label>
                <PhoneInput
                  international={false}
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
                <label>Email <span className="required-asterisk">*</span></label>
                <input type="email" placeholder="Enter email address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" className="btn-premium-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;

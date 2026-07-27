import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Lead } from './LeadTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { getLocalDateString } from './utils';
import './LeadModal.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void>;
  initialData?: Lead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({ 
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    status: 'New', 
    industry: '', 
    province: '',
    website: '',
    source: '',
    expected_revenue: undefined,
    probability: undefined,
    notes: ''
  });
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
      setFormData({ 
        name: '', 
        company: '', 
        email: '', 
        phone: '', 
        status: 'New', 
        industry: '', 
        province: '',
        website: '',
        source: '',
        expected_revenue: undefined,
        probability: undefined,
        notes: ''
      });
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
        dateAdded: initialData?.dateAdded || getLocalDateString(),
        expected_revenue: formData.expected_revenue !== undefined && (formData.expected_revenue as any) !== '' ? Number(formData.expected_revenue) : undefined,
        probability: formData.probability !== undefined && (formData.probability as any) !== '' ? Number(formData.probability) : undefined,
      } as Lead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Proposed', label: 'Proposed' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Disqualified', label: 'Disqualified' }
  ];
  if (formData.status === 'Converted') {
    statusOptions.push({ value: 'Converted', label: 'Converted' });
  }

  return (
    <div className="modal-overlay">
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
                <label>Lead Name <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  maxLength={150} 
                  placeholder="Enter name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Company <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.company || ''} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                  maxLength={150} 
                  placeholder="Enter company name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <SearchableSelect
                  options={statusOptions}
                  value={formData.status || ''}
                  onChange={val => setFormData({...formData, status: val as any})}
                  disabled={!initialData || initialData?.status === 'Converted' || initialData?.status === 'Qualified'}
                  searchable={false}
                  variant="compact"
                  placement="bottom"
                />
              </div>
            </div>
            
            {/* Row 2: Two fields (Phone, Email) */}
            <div className="lead-form-row-2" style={{ marginTop: '16px' }}>
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
                <input 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="Enter email address"
                  required 
                />
              </div>
            </div>

            {/* Row 3: Two fields (Industry, Province) */}
            <div className="lead-form-row-2" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Industry <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.industry || ''} 
                  onChange={e => setFormData({...formData, industry: e.target.value})} 
                  placeholder="Enter industry"
                  required
                />
              </div>
              <div className="form-group">
                <label>Province <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.province || ''} 
                  onChange={e => setFormData({...formData, province: e.target.value})} 
                  placeholder="Enter province"
                  required
                />
              </div>
            </div>

            {/* Row 4: Two fields (Website, Source) */}
            <div className="lead-form-row-2" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="text" 
                  value={formData.website || ''} 
                  onChange={e => setFormData({...formData, website: e.target.value})} 
                  placeholder="e.g. http://example.com"
                />
              </div>
              <div className="form-group">
                <label>Source</label>
                <input 
                  type="text" 
                  value={formData.source || ''} 
                  onChange={e => setFormData({...formData, source: e.target.value})} 
                  placeholder="e.g. Referral, Website"
                />
              </div>
            </div>

            {/* Row 5: Two fields (Expected Revenue, Probability) */}
            <div className="lead-form-row-2" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Expected Revenue</label>
                <input 
                  type="number" 
                  value={formData.expected_revenue !== undefined ? formData.expected_revenue : ''} 
                  onChange={e => setFormData({...formData, expected_revenue: e.target.value as any})} 
                  placeholder="Enter expected revenue"
                  min={0}
                />
              </div>
              <div className="form-group">
                <label>Probability (%)</label>
                <input 
                  type="number" 
                  value={formData.probability !== undefined ? formData.probability : ''} 
                  onChange={e => setFormData({...formData, probability: e.target.value as any})} 
                  placeholder="Enter probability"
                  min={0}
                  max={100}
                />
              </div>
            </div>

            {/* Row 6: One field (Notes) */}
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Notes</label>
              <textarea 
                value={formData.notes || ''} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                placeholder="Enter notes..."
              />
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

export default LeadModal;

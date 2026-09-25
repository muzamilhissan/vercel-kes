import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Lead, LeadAssignee } from './LeadTable';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { getLocalDateString, normalizeAssignee, getAssigneeAvatar } from './utils';
import './LeadModal.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void>;
  initialData?: Lead | null;
  isSuperAdmin?: boolean;
  assignableUsers?: any[];
}

const LeadModal: React.FC<LeadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  isSuperAdmin = false,
  assignableUsers = []
}) => {
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
    notes: '',
    assigned_to: ''
  });
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomPosition, setIsCustomPosition] = useState(false);
  const predefinedPositions = ['Procurement', 'Engineering', 'Maintenance Manager', 'Plant Manager', 'Operations Manager'];

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
      const assigned = typeof initialData.assigned_to === 'string' && initialData.assigned_to 
        ? initialData.assigned_to.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(initialData.assigned_to) 
          ? initialData.assigned_to.map(String)
          : [];
      setSelectedAssigneeIds(assigned);
      
      if (initialData.representative_position && !predefinedPositions.includes(initialData.representative_position)) {
        setIsCustomPosition(true);
      } else {
        setIsCustomPosition(false);
      }
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
        representative_position: '',
        expected_revenue: undefined,
        probability: undefined,
        notes: '',
        assigned_to: ''
      });
      setPhoneNumber('');
      setSelectedAssigneeIds([]);
      setIsCustomPosition(false);
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

  const toggleAssignee = (userId: string) => {
    setSelectedAssigneeIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhoneValid = handleValidate();
    if (!isPhoneValid) return;
    
    setIsSaving(true);
    try {
      const assignedUsersNormalized: LeadAssignee[] = assignableUsers
        .map(normalizeAssignee)
        .filter((u): u is LeadAssignee => u !== null && selectedAssigneeIds.includes(String(u.id)));

      await onSave({
        ...formData,
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        dateAdded: initialData?.dateAdded || getLocalDateString(),
        expected_revenue: formData.expected_revenue !== undefined && (formData.expected_revenue as any) !== '' ? Number(formData.expected_revenue) : undefined,
        probability: formData.probability !== undefined && (formData.probability as any) !== '' ? Number(formData.probability) : undefined,
        assigned_to: selectedAssigneeIds.join(','),
        assigned_users: assignedUsersNormalized,
        assignees: assignedUsersNormalized,
        assignee: assignedUsersNormalized[0] || null
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

  const normalizedUsers: LeadAssignee[] = assignableUsers.map(normalizeAssignee).filter(Boolean) as LeadAssignee[];

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Lead' : 'Create New'}</h3>
          <button onClick={onClose} disabled={isSaving}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row 1: Two fields (Lead Name, Company) */}
            <div className="lead-form-row-2">
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
            </div>

            {/* Row 2: Two fields (Status, Representative's Position) */}
            <div className="lead-form-row-2" style={{ marginTop: '16px' }}>
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
              <div className="form-group">
                <label>Representative's Position</label>
                {!isCustomPosition ? (
                  <SearchableSelect
                    options={[
                      ...predefinedPositions.map(pos => ({ value: pos, label: pos })),
                      { value: 'Other', label: 'Other' }
                    ]}
                    value={
                      formData.representative_position && !predefinedPositions.includes(formData.representative_position)
                        ? 'Other'
                        : formData.representative_position || ''
                    }
                    onChange={(val) => {
                      if (val === 'Other') {
                        setIsCustomPosition(true);
                        setFormData({ ...formData, representative_position: '' });
                      } else {
                        setFormData({ ...formData, representative_position: val as string });
                      }
                    }}
                    placeholder="Select position"
                    searchable={false}
                    variant="compact"
                    placement="bottom"
                  />
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={formData.representative_position || ''}
                      onChange={(e) => setFormData({ ...formData, representative_position: e.target.value })}
                      placeholder="Enter custom position"
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomPosition(false);
                        setFormData({ ...formData, representative_position: '' });
                      }}
                      className="btn-premium-secondary"
                      style={{ padding: '0 12px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Row 3: Two fields (Phone, Email) */}
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

            {/* Row 4: Two fields (Industry, Province) */}
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
                  type="url" 
                  value={formData.website || ''} 
                  onChange={e => setFormData({...formData, website: e.target.value})} 
                  placeholder="e.g. https://example.com"
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
                  step="any"
                />
              </div>
            </div>

            {/* Superadmin Assign To Field */}
            {isSuperAdmin && normalizedUsers.length > 0 && (
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={14} color="#70309f" />
                  <span>Assign To</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                    ({selectedAssigneeIds.length} selected)
                  </span>
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '10px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  maxHeight: '130px',
                  overflowY: 'auto'
                }}>
                  {normalizedUsers.map(user => {
                    const isSelected = selectedAssigneeIds.includes(String(user.id));
                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleAssignee(String(user.id))}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: isSelected ? '#70309f' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: `1px solid ${isSelected ? '#70309f' : '#cbd5e1'}`,
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img
                          src={user.avatar || getAssigneeAvatar(user.name || user.fullName || 'User')}
                          alt={user.name}
                          style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span>{user.fullName || user.name}</span>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

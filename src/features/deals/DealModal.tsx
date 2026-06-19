import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FrontendDeal } from './DealTable';
import { accountService } from '../../api/accountService';
import { Account } from '../../api/types';
import { useToast } from '../../context/ToastContext';
import SearchableSelect from '../../components/ui/SearchableSelect';
import '../leads/LeadModal.css'; // Reuse LeadModal CSS class names for styling

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Omit<FrontendDeal, 'accountName'> & { notes?: string }) => Promise<void>;
  initialData?: FrontendDeal | null;
}

const getLocalDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    accountId: '',
    value: 0,
    closeDate: '',
    stage: 'New',
    notes: ''
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoadingAccounts(true);
        const res = await accountService.list() as any;
        if (res.success) {
          const apiAccounts = res.accounts || res.data?.accounts || res.data;
          if (Array.isArray(apiAccounts)) {
            setAccounts(apiAccounts);
          }
        }
      } catch (err) {
        console.error('Failed to load accounts in DealModal:', err);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      // If closeDate is in format "Oct 28, 2026", convert it to YYYY-MM-DD if possible for date input.
      let formattedDate = initialData.closeDate;
      if (initialData.closeDate && !initialData.closeDate.includes('-')) {
        try {
          const d = new Date(initialData.closeDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            formattedDate = `${yyyy}-${mm}-${dd}`;
          }
        } catch {}
      }

      setFormData({
        name: initialData.name || '',
        accountId: initialData.accountId || '',
        value: initialData.value || 0,
        closeDate: formattedDate || '',
        stage: initialData.stage || 'New',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        accountId: '',
        value: 0,
        closeDate: getLocalDateString(),
        stage: 'New',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId) return;

    const selected = new Date(formData.closeDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      showToast('Expected Close Date cannot be in the past', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Re-format closeDate to human readable string if storing (e.g. "Oct 28, 2026") or pass as YYYY-MM-DD.
      // The backend accepts a string. Let's pass the date as is.
      let savedDate = formData.closeDate;
      try {
        const d = new Date(formData.closeDate);
        if (!isNaN(d.getTime())) {
          savedDate = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      } catch {}

      await onSave({
        id: initialData?.id || '',
        name: formData.name,
        accountId: formData.accountId,
        value: formData.value,
        closeDate: savedDate,
        stage: formData.stage,
        notes: formData.notes
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const stageOptions = [
    { value: 'New', label: 'New' },
    { value: 'In-progress', label: 'In-progress' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' }
  ];

  const accountOptions = accounts.map(acc => ({
    value: String(acc.id),
    label: acc.name
  }));

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-modal-compact" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Deal' : 'Create New Deal'}</h3>
          <button onClick={onClose} disabled={isSaving}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row 1: Three fields (Deal Name, Value, Stage) */}
            <div className="lead-form-row-3">
              <div className="form-group">
                <label>Deal Name <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. HVAC Installation"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Value ($) <span className="required-asterisk">*</span></label>
                <input 
                  type="number" 
                  value={formData.value || ''} 
                  onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
                  placeholder="Enter deal value"
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Stage</label>
                <SearchableSelect 
                  options={stageOptions}
                  value={formData.stage}
                  onChange={val => setFormData({...formData, stage: val})}
                  variant="compact"
                />
              </div>
            </div>
            
            {/* Row 2: Two fields (Linked Account, Close Date) */}
            <div className="lead-form-row-2">
              <div className="form-group">
                <label>Linked Account <span className="required-asterisk">*</span></label>
                <SearchableSelect
                  options={accountOptions}
                  value={formData.accountId}
                  onChange={val => setFormData({...formData, accountId: val})}
                  placeholder="-- Select Account --"
                  required
                  disabled={isLoadingAccounts}
                  variant="compact"
                />
              </div>
              <div className="form-group">
                <label>Expected Close Date <span className="required-asterisk">*</span></label>
                <input 
                  type="date" 
                  value={formData.closeDate} 
                  onChange={e => setFormData({...formData, closeDate: e.target.value})} 
                  min={getLocalDateString()}
                  required 
                />
              </div>
            </div>

            {/* Notes full width with character limit */}
            <div className="form-group" style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Notes</label>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                  {(formData.notes || '').length}/1000
                </span>
              </div>
              <textarea 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                maxLength={1000}
                placeholder="Any optional notes"
                rows={3}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.25s ease'
                }}
                onFocus={e => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#70309f';
                  e.target.style.boxShadow = '0 0 0 4px rgba(112, 48, 159, 0.06)';
                }}
                onBlur={e => {
                  e.target.style.background = '#f8fafc';
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary" disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-premium-primary" disabled={isSaving || isLoadingAccounts}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Deal } from './KanbanCard';
import { useToast } from '../../context/ToastContext';
import { accountService } from '../../api/accountService';
import SearchableSelect from '../../components/ui/SearchableSelect';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  initialData?: Deal | null;
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
  const [formData, setFormData] = useState<Partial<Deal>>({ name: '', account: '', value: 0, closeDate: '', stage: 'Backlog Tasks' });
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoadingAccounts(true);
        const res = await accountService.list() as any;
        if (res.success) {
          const apiAccounts = res.accounts || res.data?.accounts || res.data;
          if (Array.isArray(apiAccounts) && apiAccounts.length > 0) {
            setAccounts(apiAccounts.map(a => a.name));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load accounts in Kanban DealModal:', err);
      } finally {
        setIsLoadingAccounts(false);
      }

      // Fallback mock accounts if service fails/is empty
      setAccounts([
        'Prestige Plaza',
        'Metro Rail Corp',
        'National Energy',
        'Green Valley',
        'City Council'
      ]);
    };

    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
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
        ...initialData,
        closeDate: formattedDate
      });
    } else {
      setFormData({
        name: '',
        account: '',
        value: 0,
        closeDate: getLocalDateString(),
        stage: 'Backlog Tasks'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.closeDate) return;

    const selected = new Date(formData.closeDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      showToast('Close Date cannot be in the past', 'error');
      return;
    }

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

    onSave({
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      closeDate: savedDate,
      tags: initialData?.tags || [],
      avatars: initialData?.avatars || [],
      notesCount: initialData?.notesCount || 0,
      filesCount: initialData?.filesCount || 0
    } as Deal);
    onClose();
  };

  const stageOptions = [
    { value: 'Backlog Tasks', label: 'Backlog Tasks' },
    { value: 'To Do Tasks', label: 'To Do Tasks' },
    { value: 'In Process', label: 'In Process' },
    { value: 'Done', label: 'Done' }
  ];

  const accountOptions = accounts.map(accName => ({
    value: accName,
    label: accName
  }));

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{initialData ? 'Edit Deal' : 'New Deal'}</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group"><label>Deal Name</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group">
              <label>Linked Account</label>
              <SearchableSelect
                options={accountOptions}
                value={formData.account || ''}
                onChange={val => setFormData({...formData, account: val})}
                placeholder="-- Select Account --"
                required
                disabled={isLoadingAccounts}
                variant="premium"
              />
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Value ($)</label><input type="number" value={formData.value || 0} onChange={e => setFormData({...formData, value: Number(e.target.value)})} required /></div>
              <div className="form-group"><label>Close Date</label><input type="date" value={formData.closeDate || ''} onChange={e => setFormData({...formData, closeDate: e.target.value})} min={getLocalDateString()} required /></div>
            </div>
            <div className="form-group">
              <label>Pipeline Stage</label>
              <SearchableSelect
                options={stageOptions}
                value={formData.stage || ''}
                onChange={val => setFormData({...formData, stage: val})}
                variant="premium"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" className="btn-premium-primary">Save Deal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealModal;

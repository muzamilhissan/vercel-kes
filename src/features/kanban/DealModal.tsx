import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Deal } from './KanbanCard';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  initialData?: Deal | null;
}

const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Deal>>({ name: '', account: '', value: 0, closeDate: '', stage: 'Backlog Tasks' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', account: '', value: 0, closeDate: '', stage: 'Backlog Tasks' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{initialData ? 'Edit Deal' : 'New Deal'}</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, id: initialData?.id || Math.random().toString(36).substr(2, 9), tags: initialData?.tags || [], avatars: initialData?.avatars || [], notesCount: initialData?.notesCount || 0, filesCount: initialData?.filesCount || 0} as Deal); onClose(); }}>
          <div className="modal-body">
            <div className="form-group"><label>Deal Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group"><label>Linked Account</label><input type="text" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="form-group"><label>Value ($)</label><input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} required /></div>
              <div className="form-group"><label>Close Date</label><input type="text" value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label>Pipeline Stage</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                <option value="Backlog Tasks">Backlog Tasks</option><option value="To Do Tasks">To Do Tasks</option><option value="In Process">In Process</option><option value="Done">Done</option>
              </select>
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

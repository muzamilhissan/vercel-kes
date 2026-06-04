import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead } from './LeadTable';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  initialData?: Lead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', company: '', email: '', phone: '', status: 'New' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', company: '', email: '', phone: '', status: 'New' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>{initialData ? 'Edit Lead' : 'Create New Lead'}</h3><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({...formData, id: initialData?.id || Math.random().toString(36).substr(2, 9), dateAdded: initialData?.dateAdded || new Date().toLocaleDateString()} as Lead); onClose(); }}>
          <div className="modal-body">
            <div className="form-group"><label>Lead Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
            <div className="form-group"><label>Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
              <div className="form-group"><label>Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label>Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" className="btn-premium-primary">Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;

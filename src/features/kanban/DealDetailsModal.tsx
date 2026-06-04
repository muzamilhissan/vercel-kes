import React, { useState } from 'react';
import { X, MessageSquare, Paperclip, Clock, Send } from 'lucide-react';
import { Deal } from './KanbanCard';
import './DealDetailsModal.css';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  onAddNote: (dealId: string, note: string) => void;
}

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({ isOpen, onClose, deal, onAddNote }) => {
  const [note, setNote] = useState('');
  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!note.trim()) return;
    onAddNote(deal.id, note);
    setNote('');
  };

  return (
    <div className="modal-overlay">
      <div className="details-modal-content">
        <div className="details-header">
          <div><h2>{deal.name}</h2><p>{deal.account}</p></div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="details-body">
          <section className="notes-section">
            <div className="section-header"><MessageSquare size={18} /> <h3>Notes & Activity</h3></div>
            <div className="note-input">
              <textarea placeholder="Add a timestamped note..." value={note} onChange={e => setNote(e.target.value)} />
              <button onClick={handleAddNote} className="btn-send"><Send size={18} /></button>
            </div>
            <div className="activity-list">
              <div className="activity-item"><Clock size={14} /> <span><strong>User</strong> added a note: "Initial discovery call completed." <small>Just now</small></span></div>
              <div className="activity-item"><Clock size={14} /> <span><strong>System</strong> changed stage to <strong>{deal.stage}</strong> <small>2 hours ago</small></span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsModal;

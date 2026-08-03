import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LeadFollowUp, CreateFollowUpInput, UpdateFollowUpInput } from '../../../api/types';
import './LeadFollowUpFormModal.css';

interface LeadFollowUpFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFollowUpInput | UpdateFollowUpInput) => Promise<void>;
  initialData?: LeadFollowUp;
}

const LeadFollowUpFormModal: React.FC<LeadFollowUpFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate((initialData as any).date || initialData.follow_up_date || '');
        setTime((initialData as any).time || initialData.follow_up_time || '');
        setNotes(initialData.notes || '');
      } else {
        setDate('');
        setTime('');
        setNotes('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        time,
        notes,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting follow-up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="follow-up-modal-overlay">
      <div className="follow-up-modal-container">
        <div className="follow-up-modal-header">
          <h2>{initialData ? 'Edit Follow-up' : 'Schedule Follow-up'}</h2>
          <button type="button" className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="follow-up-modal-body">
            <div className="follow-up-form-group">
              <label htmlFor="followUpDate">Date *</label>
              <input 
                type="date" 
                id="followUpDate"
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="follow-up-form-group">
              <label htmlFor="followUpTime">Time *</label>
              <input 
                type="time" 
                id="followUpTime"
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="follow-up-form-group" style={{ flex: 1 }}>
              <label htmlFor="followUpNotes">Notes</label>
              <textarea 
                id="followUpNotes"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                maxLength={255}
                style={{ resize: 'vertical' }}
                placeholder="Add details about this follow-up..."
              />
            </div>
          </div>

          <div className="follow-up-modal-footer">
            <button type="button" className="follow-up-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="follow-up-btn-primary" disabled={isSubmitting || !date || !time}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFollowUpFormModal;

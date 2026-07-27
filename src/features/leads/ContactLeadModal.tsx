import React, { useState } from 'react';
import { X, Contact2, Mail, Phone, Loader2 } from 'lucide-react';
import { Lead } from './LeadTable';
import { leadService } from '../../api/leadService';
import { useToast } from '../../context/ToastContext';
import './ContactLeadModal.css';

interface ContactLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onLeadUpdated?: (lead: Lead) => void;
}

const ContactLeadModal: React.FC<ContactLeadModalProps> = ({ isOpen, onClose, lead, onLeadUpdated }) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleMarkContacted = async () => {
    try {
      setIsLoading(true);
      const response = await leadService.updateStatus(lead.id, 'Contacted');
      
      if (response.success) {
        showToast('Lead status updated to Contacted', 'success');
        if (onLeadUpdated) {
          onLeadUpdated({ ...lead, status: 'Contacted' });
        }
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
        onClose();
      } else {
        showToast(response.message || 'Failed to update lead status', 'error');
      }
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      showToast(error.message || 'Failed to update lead status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content contact-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <X size={20} />
        </button>
        
        <div className="contact-modal-header">
          <Contact2 size={24} className="contact-header-icon" />
          <h2>Contact Information</h2>
        </div>

        <div className="contact-modal-body">
          <h1 className="contact-lead-name">{lead.name}</h1>
          
          <div className="contact-info-section">
            <div className="contact-field">
              <span className="contact-label">Contact Person:</span>
              <span className="contact-value">{lead.name}</span>
            </div>
            
            <div className="contact-field">
              <span className="contact-label">Email:</span>
              <div className="contact-value with-icon">
                <Mail size={16} />
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
            </div>
            
            <div className="contact-field">
              <span className="contact-label">Phone:</span>
              <div className="contact-value with-icon">
                <Phone size={16} />
                <a href={`tel:${lead.phone}`}>{lead.phone}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-modal-footer">
          <button 
            className="btn-premium-primary" 
            onClick={handleMarkContacted}
            disabled={isLoading || lead.status === 'Contacted'}
            style={{ opacity: lead.status === 'Contacted' ? 0.6 : 1 }}
          >
            {lead.status === 'Contacted' ? 'Already Contacted' : isLoading ? 'Marking as Contacted...' : 'Mark as Contacted'}
          </button>
          <button className="btn-premium-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactLeadModal;

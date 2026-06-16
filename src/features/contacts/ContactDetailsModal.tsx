import React from 'react';
import { X } from 'lucide-react';
import { Contact } from './ContactTable';
import './ContactModal.css';

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content contact-modal-compact">
        <div className="modal-header">
          <h3>Contact Details</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px 32px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{contact.name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Title</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{contact.jobTitle || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Account</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{contact.accountName || 'No Account'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', wordBreak: 'break-all' }}>{contact.email}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{contact.phone}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc', borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' }}>
          <button onClick={onClose} className="btn-premium-primary" style={{ padding: '10px 24px', borderRadius: '10px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;

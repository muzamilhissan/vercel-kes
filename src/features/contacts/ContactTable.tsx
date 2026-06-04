import React from 'react';
import { MoreVertical, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import './ContactTable.css';

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  accountId: string;
  accountName: string;
}

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title</th>
            <th>Account</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>
                <div className="avatar-cell">
                  <div className="avatar-circle">{contact.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600 }}>{contact.name}</span>
                </div>
              </td>
              <td style={{ color: '#64748b' }}>{contact.jobTitle}</td>
              <td style={{ fontWeight: 600, color: '#70309f' }}>{contact.accountName}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td className="text-right">
                <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                  <button className="action-btn" onClick={() => onEdit(contact)}><Edit2 size={16} /></button>
                  <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => onDelete(contact)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;

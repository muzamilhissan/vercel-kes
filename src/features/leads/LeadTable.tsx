import React from 'react';
import { MoreVertical, Edit2, Trash2, UserPlus } from 'lucide-react';
import './LeadTable.css';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  dateAdded: string;
}

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onConvert }) => {
  return (
    <div className="table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Date Added</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>
                <div className="avatar-cell">
                  <div className="avatar-circle">{lead.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600 }}>{lead.name}</span>
                </div>
              </td>
              <td style={{ color: '#64748b' }}>{lead.company}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>
                <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                  {lead.status}
                </span>
              </td>
              <td style={{ color: '#64748b' }}>{lead.dateAdded}</td>
              <td className="text-right">
                <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                  <button className="action-btn" title="Edit Lead" onClick={() => onEdit(lead)}><Edit2 size={16} /></button>
                  <button className="action-btn" title="Delete Lead" style={{ color: '#ef4444' }} onClick={() => onDelete(lead)}><Trash2 size={16} /></button>
                  <button className="action-btn" title="Convert to Contact" style={{ color: '#10b981' }} onClick={() => onConvert(lead)}><UserPlus size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;

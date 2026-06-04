import React from 'react';
import { Building2, Globe, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import './AccountTable.css';

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
}

interface AccountTableProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onView: (account: Account) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({ accounts, onEdit, onDelete, onView }) => {
  return (
    <div className="table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Website</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id} onClick={() => onView(account)}>
              <td>
                <div className="avatar-cell">
                  <div className="avatar-circle" style={{ backgroundColor: '#f5f0fa', color: '#70309f' }}>
                    <Building2 size={16} />
                  </div>
                  <span style={{ fontWeight: 600 }}>{account.name}</span>
                </div>
              </td>
              <td style={{ color: '#64748b' }}>{account.industry}</td>
              <td>
                <a href={`https://${account.website}`} target="_blank" rel="noreferrer" style={{ color: '#70309f', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                  <Globe size={14} /> {account.website}
                </a>
              </td>
              <td className="text-right" onClick={e => e.stopPropagation()}>
                <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                  <button className="action-btn" onClick={() => onEdit(account)}><Edit2 size={16} /></button>
                  <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => onDelete(account)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;

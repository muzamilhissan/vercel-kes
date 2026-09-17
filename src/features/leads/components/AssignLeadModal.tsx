import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Search, Loader2 } from 'lucide-react';
import { Lead, LeadAssignee } from '../LeadTable';
import { getAssigneeAvatar, normalizeAssignee } from '../utils';
import './AssignLeadModal.css';

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  assignableUsers: any[];
  onAssign: (lead: Lead, userIds: (string | number)[]) => Promise<void>;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  assignableUsers,
  onAssign,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      const assigned = typeof lead.assigned_to === 'string' && lead.assigned_to 
        ? lead.assigned_to.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(lead.assigned_to) 
          ? lead.assigned_to.map(String)
          : [];
      setSelectedIds(assigned);
      setSearchQuery('');
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  // Normalize user list
  const normalizedUsers: LeadAssignee[] = assignableUsers.map(normalizeAssignee).filter(Boolean) as LeadAssignee[];

  // Filter based on search query
  const filteredUsers = normalizedUsers.filter(user => {
    const term = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.fullName && user.fullName.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.designation && user.designation.toLowerCase().includes(term))
    );
  });

  const toggleUser = (userId: string) => {
    setSelectedIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSave = async () => {
    if (!lead) return;
    setIsSaving(true);
    try {
      await onAssign(lead, selectedIds);
      onClose();
    } catch (err) {
      console.error('Error assigning users:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="assign-modal-overlay" onClick={onClose}>
      <div className="assign-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="assign-modal-header">
          <div className="assign-header-left">
            <div className="assign-header-icon">
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Assign Lead</h3>
              <p>Select team members to manage this lead</p>
            </div>
          </div>
          <button className="assign-modal-close-btn" onClick={onClose} disabled={isSaving}>
            <X size={18} />
          </button>
        </div>

        {/* Lead Summary */}
        <div className="assign-lead-summary-card">
          <div>
            <div className="assign-lead-title">{lead.name}</div>
            <div className="assign-lead-company">{lead.company || 'No Company'}</div>
          </div>
          <span className={`status-badge status-${lead.status.toLowerCase()}`}>
            {lead.status}
          </span>
        </div>

        {/* Search */}
        <div className="assign-search-box">
          <Search size={15} className="assign-search-icon" />
          <input
            type="text"
            placeholder="Search team members by name, email, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={isSaving}
          />
        </div>

        {/* Users List */}
        <div className="assign-users-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              const isSelected = selectedIds.includes(String(user.id));
              return (
                <div
                  key={user.id}
                  className={`assign-user-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isSaving && toggleUser(String(user.id))}
                >
                  <div className="assign-user-info">
                    <img
                      src={user.avatar || getAssigneeAvatar(user.name || user.fullName || 'User')}
                      alt={user.name}
                      className="assign-user-avatar"
                    />
                    <div className="assign-user-details">
                      <span className="assign-user-name">{user.fullName || user.name}</span>
                      <div className="assign-user-meta">
                        {user.email && <span>{user.email}</span>}
                        {user.designation && (
                          <span className="assign-user-designation">{user.designation}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="assign-checkbox">
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              {normalizedUsers.length === 0 ? 'No assignable users available' : 'No users match your search'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="assign-modal-footer">
          <div className="assign-selected-count">
            {selectedIds.length === 0 ? (
              <span>Unassigned (0 selected)</span>
            ) : (
              <span>{selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <div className="assign-footer-actions">
            <button
              type="button"
              className="btn-assign-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-assign-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="lucide-spin" /> Saving...
                </>
              ) : (
                'Save Assignment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;

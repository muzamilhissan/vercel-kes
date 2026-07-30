import React, { useEffect, useState } from 'react';
import { Proposal } from '../../../api/types';
import { proposalService } from '../../../api/proposalService';
import { useToast } from '../../../context/ToastContext';
import { FileText, Eye, Edit2, Trash2, Download } from 'lucide-react';
import ViewProposalModal from '../ViewProposalModal';
import EditProposalModal from '../EditProposalModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import './LeadProposalsList.css';

interface LeadProposalsListProps {
  leadId: string | number;
  onRefreshTrigger?: number;
}

const LeadProposalsList: React.FC<LeadProposalsListProps> = ({ leadId, onRefreshTrigger }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposalForView, setSelectedProposalForView] = useState<Proposal | null>(null);
  const [selectedProposalForEdit, setSelectedProposalForEdit] = useState<Proposal | null>(null);
  const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);
  const { showToast } = useToast();

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await proposalService.listProposals(leadId);
      if (res.success || Array.isArray(res.data) || Array.isArray((res as any).proposals) || Array.isArray(res)) {
        let items = res.data || (res as any).proposals || res;
        setProposals(Array.isArray(items) ? items : []);
      } else {
        showToast(res.message || 'Failed to load proposals', 'error');
      }
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
      showToast(err.message || 'Failed to load proposals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [leadId, onRefreshTrigger]);

  const confirmDelete = async () => {
    if (!proposalToDelete) return;
    
    try {
      const res = await proposalService.deleteProposal(leadId, proposalToDelete.id);
      if (res.success) {
        showToast('Proposal deleted successfully', 'success');
        fetchProposals();
      } else {
        showToast(res.message || 'Failed to delete proposal', 'error');
      }
    } catch (err: any) {
      console.error('Error deleting proposal:', err);
      showToast(err.message || 'Error deleting proposal', 'error');
    } finally {
      setProposalToDelete(null);
    }
  };

  if (loading) {
    return <div className="proposals-loading">Loading proposals...</div>;
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="proposals-empty-state">
        <FileText size={48} className="empty-icon" />
        <h3>No proposals found</h3>
        <p>This lead currently doesn't have any associated proposals.</p>
      </div>
    );
  }

  return (
    <div className="lead-proposals-container">
      <div className="proposals-list">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="proposal-card">
            <div className="proposal-card-header">
              <h4 className="proposal-subject">{proposal.subject}</h4>
              <div className="proposal-actions">
                <button className="action-btn view-btn" title="View Proposal" onClick={() => setSelectedProposalForView(proposal)}>
                  <Eye size={16} />
                </button>
                <button className="action-btn edit-btn" title="Edit Proposal" onClick={() => setSelectedProposalForEdit(proposal)}>
                  <Edit2 size={16} />
                </button>
                <button className="action-btn delete-btn" title="Delete Proposal" onClick={() => setProposalToDelete(proposal)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="proposal-content-preview">
              {proposal.content && proposal.content.length > 150 ? proposal.content.substring(0, 150) + '...' : proposal.content || ''}
            </div>
            
            <div className="proposal-meta">
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">
                  {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Attachments:</span>
                <span className="meta-value">
                  {proposal.attachments ? proposal.attachments.length : 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ViewProposalModal 
        isOpen={!!selectedProposalForView}
        onClose={() => setSelectedProposalForView(null)}
        proposal={selectedProposalForView}
      />

      <EditProposalModal 
        isOpen={!!selectedProposalForEdit}
        onClose={() => setSelectedProposalForEdit(null)}
        proposal={selectedProposalForEdit}
        leadId={leadId}
        onSuccess={() => {
          setSelectedProposalForEdit(null);
          fetchProposals();
        }}
      />

      <ConfirmModal
        isOpen={!!proposalToDelete}
        onClose={() => setProposalToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Proposal"
        message={`Are you sure you want to delete the proposal "${proposalToDelete?.subject}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default LeadProposalsList;

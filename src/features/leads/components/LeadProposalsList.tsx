import React, { useEffect, useState } from 'react';
import { Proposal } from '../../../api/types';
import { proposalService } from '../../../api/proposalService';
import { useToast } from '../../../context/ToastContext';
import { FileText, Eye, Edit2, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import ViewProposalModal from '../ViewProposalModal';
import EditProposalModal from '../EditProposalModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import './LeadProposalsList.css';

interface ProposalWithMeta extends Proposal {
  proposalNumber?: number;
  isLatest?: boolean;
}

interface LeadProposalsListProps {
  leadId: string | number;
  onRefreshTrigger?: number;
  onRepropose?: (nextProposalNumber: number) => void;
  onSendProposal?: () => void;
}

const LeadProposalsList: React.FC<LeadProposalsListProps> = ({
  leadId,
  onRefreshTrigger,
  onRepropose,
  onSendProposal,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposalForView, setSelectedProposalForView] = useState<ProposalWithMeta | null>(null);
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
      <div className="lead-proposals-container">
        <div className="proposals-empty-state">
          <div className="empty-icon-wrap">
            <FileText size={44} className="empty-icon" />
          </div>
          <h3>No proposals found</h3>
          <p>This lead currently doesn't have any associated proposals.</p>
          {onSendProposal && (
            <button
              type="button"
              className="btn-draft-first-proposal"
              onClick={onSendProposal}
            >
              <Sparkles size={16} />
              <span>Draft First Proposal</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Assign sequence numbers chronologically (oldest first = Proposal #1, #2, ...)
  const indexedProposals: ProposalWithMeta[] = [...proposals]
    .sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return timeA - timeB;
    })
    .map((proposal, idx, arr) => ({
      ...proposal,
      proposalNumber: idx + 1,
      isLatest: idx === arr.length - 1,
    }));

  // Show newest proposal first
  const displayProposals = [...indexedProposals].reverse();
  const nextProposalNumber = proposals.length + 1;

  return (
    <div className="lead-proposals-container">
      {/* Section Header with Re-propose Action */}
      <div className="proposals-section-header">
        <div className="proposals-header-left">
          <div className="proposals-title-group">
            <h3 className="proposals-section-title">Proposals</h3>
            <span className="proposals-count-pill">{proposals.length}</span>
          </div>
          <p className="proposals-section-subtitle">
            Review past proposal submissions or generate a second/revised proposal with AI.
          </p>
        </div>
        {onRepropose && (
          <button
            type="button"
            className="btn-repropose-primary"
            onClick={() => onRepropose(nextProposalNumber)}
            title={`Generate Proposal #${nextProposalNumber} with AI`}
          >
            <RotateCcw size={15} className="repropose-btn-icon" />
            <span>Re-propose</span>
            <span className="repropose-btn-badge">Proposal #{nextProposalNumber}</span>
          </button>
        )}
      </div>

      <div className="proposals-list">
        {displayProposals.map((proposal) => (
          <div key={proposal.id} className="proposal-card">
            <div className="proposal-card-header">
              <div className="proposal-title-box">
                <div className="proposal-badges-row">
                  <span className="proposal-num-badge">Proposal #{proposal.proposalNumber}</span>
                  {proposal.isLatest && (
                    <span className="proposal-latest-badge">Latest</span>
                  )}
                </div>
                <h4 className="proposal-subject">{proposal.subject}</h4>
              </div>
              <div className="proposal-actions">
                {onRepropose && (
                  <button
                    className="action-btn repropose-btn"
                    title={`Re-propose (Proposal #${nextProposalNumber})`}
                    onClick={() => onRepropose(nextProposalNumber)}
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  className="action-btn view-btn"
                  title="View Proposal"
                  onClick={() => setSelectedProposalForView(proposal)}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="action-btn edit-btn"
                  title="Edit Proposal"
                  onClick={() => setSelectedProposalForEdit(proposal)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="action-btn delete-btn"
                  title="Delete Proposal"
                  onClick={() => setProposalToDelete(proposal)}
                >
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
        onRepropose={onRepropose ? () => {
          setSelectedProposalForView(null);
          onRepropose(nextProposalNumber);
        } : undefined}
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

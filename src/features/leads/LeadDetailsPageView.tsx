import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Lead } from './LeadTable';
import LeadDetailsStepper from './components/LeadDetailsStepper';
import LeadContactInfo from './components/LeadContactInfo';
import LeadDetailsCard from './components/LeadDetailsCard';
import LeadEngagementStats from './components/LeadEngagementStats';
import LeadActivityTimeline from './components/LeadActivityTimeline';
import LeadQuickActions from './components/LeadQuickActions';
import ContactLeadModal from './ContactLeadModal';
import SendProposalModal from './SendProposalModal';
import LeadProposalsList from './components/LeadProposalsList';
import LeadFollowUpsList from './components/LeadFollowUpsList';
import { leadService } from '../../api/leadService';
import { useToast } from '../../context/ToastContext';
import './LeadDetailsPageView.css';

interface LeadDetailsPageViewProps {
  lead: Lead;
  onBack: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadDetailsPageView: React.FC<LeadDetailsPageViewProps> = ({ lead, onBack, onEdit, onDelete }) => {
  const [localLead, setLocalLead] = React.useState(lead);
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);
  const [isSendProposalModalOpen, setIsSendProposalModalOpen] = React.useState(false);
  const [isRepropose, setIsRepropose] = React.useState(false);
  const [proposalNumber, setProposalNumber] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'proposals' | 'followups'>('overview');
  const [refreshProposals, setRefreshProposals] = React.useState(0);
  const { showToast } = useToast();

  React.useEffect(() => {
    setLocalLead(lead);
  }, [lead]);

  const handleOpenSendProposal = () => {
    setIsRepropose(false);
    setProposalNumber(1);
    setIsSendProposalModalOpen(true);
  };

  const handleOpenRepropose = (nextNum: number = 2) => {
    setIsRepropose(true);
    setProposalNumber(nextNum);
    setIsSendProposalModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const res = await leadService.updateStatus(localLead.id, newStatus);
      if (res.success) {
        const updatedLead = { ...localLead, status: newStatus as any };
        setLocalLead(updatedLead);
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
        showToast('Lead status updated successfully', 'success');
      } else {
        showToast(res.message || 'Failed to update lead status', 'error');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      showToast(err.message || 'Error updating lead status', 'error');
    }
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="lead-details-page">
      <div className="lead-details-page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
        <button className="back-btn" onClick={onBack} style={{ flexShrink: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
        <div className="lead-avatar" style={{ margin: 0 }}>
          {getInitials(localLead.name || 'L')}
        </div>
        <div className="lead-profile-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, lineHeight: 1.2 }}>{localLead.name}</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{localLead.email}</p>
        </div>
      </div>

      <LeadDetailsStepper currentStatus={localLead.status} />

      <div className="lead-details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
          onClick={() => setActiveTab('proposals')}
        >
          Proposals
        </button>
        <button 
          className={`tab-btn ${activeTab === 'followups' ? 'active' : ''}`}
          onClick={() => setActiveTab('followups')}
        >
          Follow-ups
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="lead-details-content-grid">
          <div className="lead-details-left-col">
            <LeadContactInfo lead={localLead} />
            <LeadEngagementStats />
            <LeadActivityTimeline lead={localLead} />
          </div>
          
          <div className="lead-details-right-col">
            <LeadDetailsCard lead={localLead} />
            <LeadQuickActions 
              lead={localLead}
              onContactClick={() => setIsContactModalOpen(true)} 
              onSendProposalClick={handleOpenSendProposal}
              onReproposeClick={() => handleOpenRepropose(2)}
              onEditClick={() => onEdit(localLead)}
              onDeleteClick={() => onDelete(localLead)}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </div>
      )}

      {activeTab === 'proposals' && (
        <LeadProposalsList 
          leadId={localLead.id} 
          onRefreshTrigger={refreshProposals}
          onRepropose={handleOpenRepropose}
          onSendProposal={handleOpenSendProposal}
        />
      )}
      
      {activeTab === 'followups' && (
        <LeadFollowUpsList leadId={localLead.id} />
      )}
      
      <ContactLeadModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        lead={localLead} 
        onLeadUpdated={setLocalLead} 
      />
      <SendProposalModal 
        isOpen={isSendProposalModalOpen} 
        onClose={() => setIsSendProposalModalOpen(false)} 
        lead={localLead} 
        isRepropose={isRepropose}
        proposalNumber={proposalNumber}
        onSuccess={() => {
          setIsSendProposalModalOpen(false);
          setRefreshProposals(prev => prev + 1);
          setActiveTab('proposals');
          if (localLead.status !== 'Proposed') {
            handleStatusUpdate('Proposed');
          }
        }}
      />
    </div>
  );
};

export default LeadDetailsPageView;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, XCircle, FileText, CheckCircle, Trash2 } from 'lucide-react';
import { leadService } from '../../../api/leadService';
import { LeadFollowUp } from '../../../api/types';
import { useToast } from '../../../context/ToastContext';
import LeadFollowUpFormModal from './LeadFollowUpFormModal';
import DeleteModal from '../../accounts/DeleteModal';
import './LeadFollowUpsList.css';

interface LeadFollowUpsListProps {
  leadId: string | number;
}

const LeadFollowUpsList: React.FC<LeadFollowUpsListProps> = ({ leadId }) => {
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteFollowUpModalOpen, setIsDeleteFollowUpModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<LeadFollowUp | undefined>(undefined);
  const { showToast } = useToast();

  const fetchFollowUps = async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getFollowUps(leadId);
      if (response.success) {
        const data = response.data || (response as any).follow_ups || (response as any).followUps || [];
        setFollowUps(Array.isArray(data) ? data : []);
      } else {
        showToast(response.message || 'Failed to fetch follow-ups', 'error');
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      showToast('Error loading follow-ups', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [leadId]);

  const handleAddFollowUp = () => {
    setSelectedFollowUp(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditFollowUp = (followUp: LeadFollowUp) => {
    setSelectedFollowUp(followUp);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      let response;
      if (selectedFollowUp) {
        response = await leadService.updateFollowUp(leadId, selectedFollowUp.id, data);
      } else {
        response = await leadService.createFollowUp(leadId, data);
      }
      
      if (response.success) {
        showToast(`Follow-up ${selectedFollowUp ? 'updated' : 'scheduled'} successfully`, 'success');
        fetchFollowUps();
      } else {
        showToast(response.message || 'Action failed', 'error');
      }
    } catch (error) {
      console.error('Error saving follow-up:', error);
      showToast('Error saving follow-up', 'error');
      throw error; // Rethrow so modal doesn't close on error
    }
  };

  const handleCancelClick = (followUp: LeadFollowUp) => {
    setSelectedFollowUp(followUp);
    setIsCancelModalOpen(true);
  };

  const confirmCancelFollowUp = async () => {
    if (!selectedFollowUp) return;
    try {
      const response = await leadService.cancelFollowUp(leadId, selectedFollowUp.id);
      if (response.success) {
        showToast('Follow-up cancelled successfully', 'success');
        fetchFollowUps();
      } else {
        showToast(response.message || 'Failed to cancel follow-up', 'error');
      }
    } catch (error) {
      console.error('Error cancelling follow-up:', error);
      showToast('Error cancelling follow-up', 'error');
    } finally {
      setIsCancelModalOpen(false);
      setSelectedFollowUp(undefined);
    }
  };

  const handleDeleteClick = (followUp: LeadFollowUp) => {
    setSelectedFollowUp(followUp);
    setIsDeleteFollowUpModalOpen(true);
  };

  const confirmDeleteFollowUp = async () => {
    if (!selectedFollowUp) return;
    try {
      const response = await leadService.deleteFollowUp(leadId, selectedFollowUp.id);
      if (response.success) {
        showToast('Follow-up deleted successfully', 'success');
        fetchFollowUps();
      } else {
        showToast(response.message || 'Failed to delete follow-up', 'error');
      }
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      showToast('Error deleting follow-up', 'error');
    } finally {
      setIsDeleteFollowUpModalOpen(false);
      setSelectedFollowUp(undefined);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return <span className="status-badge status-completed">Completed</span>;
    if (s === 'cancelled') return <span className="status-badge status-cancelled">Cancelled</span>;
    return <span className="status-badge status-scheduled">Scheduled</span>;
  };

  if (isLoading) {
    return <div className="follow-ups-loading">Loading follow-ups...</div>;
  }

  return (
    <div className="lead-follow-ups-container">
      <div className="follow-ups-header">
        <h3>Follow-ups</h3>
        <button className="btn-primary" onClick={handleAddFollowUp}>
          + Add Follow-up
        </button>
      </div>

      {!followUps || followUps.length === 0 ? (
        <div className="follow-ups-empty">
          <Calendar size={48} className="empty-icon" />
          <p>No follow-ups found.</p>

        </div>
      ) : (
        <div className="table-responsive">
          <table className="follow-ups-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Notes</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((followUp) => (
                <tr key={followUp.id} className={followUp.status?.toLowerCase() === 'cancelled' ? 'is-cancelled' : ''}>
                  <td>
                    <div className="datetime-item">
                      <Calendar size={16} />
                      <span>{(followUp as any).date || followUp.follow_up_date || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="datetime-item">
                      <Clock size={16} />
                      <span>{(followUp as any).time || followUp.follow_up_time || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="notes-col">
                    <p>{followUp.notes || '-'}</p>
                  </td>
                  <td>
                    {getStatusBadge(followUp.status)}
                  </td>
                  <td>
                    <div className="follow-up-table-actions">
                      <button 
                        className="follow-up-action-btn edit-btn" 
                        title="Edit"
                        onClick={() => handleEditFollowUp(followUp)}
                        disabled={followUp.status?.toLowerCase() === 'cancelled'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="follow-up-action-btn cancel-btn" 
                        title="Cancel"
                        onClick={() => handleCancelClick(followUp)}
                        disabled={followUp.status?.toLowerCase() === 'cancelled'}
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        className="follow-up-action-btn delete-btn" 
                        title="Delete"
                        onClick={() => handleDeleteClick(followUp)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadFollowUpFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedFollowUp}
      />

      <DeleteModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancelFollowUp}
        title="Cancel Follow-up"
        message="Are you sure you want to cancel this follow-up?"
        confirmText="Cancel"
      />

      <DeleteModal
        isOpen={isDeleteFollowUpModalOpen}
        onClose={() => setIsDeleteFollowUpModalOpen(false)}
        onConfirm={confirmDeleteFollowUp}
        title="Delete Follow-up"
        message="Are you sure you want to delete this follow-up permanently?"
        confirmText="Delete"
        iconType="trash"
      />
    </div>
  );
};

export default LeadFollowUpsList;

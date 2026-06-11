import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import LeadTable, { Lead } from '../features/leads/LeadTable';
import LeadModal from '../features/leads/LeadModal';
import DeleteModal from '../features/leads/DeleteModal';
import ConvertModal from '../features/leads/ConvertModal';
import { Plus } from 'lucide-react';
import { leadService } from '../api/leadService';
import { useToast } from '../context/ToastContext';

const mapApiLeadToFrontendLead = (apiLead: any): Lead => {
  // Normalize status to match LeadTable status type: 'New' | 'Contacted' | 'Qualified' | 'Converted'
  let normalizedStatus: 'New' | 'Contacted' | 'Qualified' | 'Converted' = 'New';
  if (apiLead.status) {
    const statusLower = apiLead.status.toLowerCase();
    if (statusLower === 'contacted') normalizedStatus = 'Contacted';
    else if (statusLower === 'qualified') normalizedStatus = 'Qualified';
    else if (statusLower === 'converted') normalizedStatus = 'Converted';
  }

  // Format dateAdded using created_at or fallback
  let dateStr = '';
  if (apiLead.created_at) {
    try {
      dateStr = new Date(apiLead.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      dateStr = String(apiLead.created_at);
    }
  } else if (apiLead.dateAdded) {
    dateStr = apiLead.dateAdded;
  } else {
    dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return {
    id: String(apiLead.id),
    name: apiLead.name || '',
    company: apiLead.company || '',
    email: apiLead.email || '',
    phone: apiLead.phone || '',
    status: normalizedStatus,
    dateAdded: dateStr,
  };
};

const LeadsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [isConvertingLead, setIsConvertingLead] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await leadService.list() as any;
      if (res.success) {
        const apiLeads = res.leads || res.data?.leads || res.data;
        if (Array.isArray(apiLeads)) {
          setLeads(apiLeads.map(mapApiLeadToFrontendLead));
          window.dispatchEvent(new CustomEvent('leadsUpdated'));
        } else {
          setLeads([]);
          window.dispatchEvent(new CustomEvent('leadsUpdated'));
        }
      } else {
        setError(res.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSaveLead = async (leadData: Lead) => {
    try {
      setError(null);
      if (selectedLead) {
        // Edit flow
        const payload = {
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
          status: leadData.status,
        };
        const res = await leadService.update(selectedLead.id, payload);
        if (res.success) {
          await fetchLeads();
          showToast('Lead updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update lead', 'error');
        }
      } else {
        // Create flow
        const payload = {
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
        };
        const res = await leadService.store(payload);
        if (res.success) {
          await fetchLeads();
          showToast('Lead created successfully', 'success');
        } else {
          showToast(res.message || 'Failed to create lead', 'error');
        }
      }
      setIsLeadModalOpen(false);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      showToast(err.message || 'Error saving lead', 'error');
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    try {
      setIsDeletingLead(true);
      setError(null);
      const res = await leadService.delete(selectedLead.id);
      if (res.success) {
        await fetchLeads();
        showToast('Lead deleted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to delete lead', 'error');
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      showToast(err.message || 'Error deleting lead', 'error');
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleConvertLead = async () => {
    if (!selectedLead) return;
    try {
      setIsConvertingLead(true);
      setError(null);
      const payload = {
        contact_name: selectedLead.name,
        contact_company: selectedLead.company,
        contact_email: selectedLead.email,
        contact_phone: selectedLead.phone,
      };
      const res = await leadService.convert(selectedLead.id, payload);
      if (res.success) {
        await fetchLeads();
        showToast('Lead converted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to convert lead', 'error');
      }
      setIsConvertModalOpen(false);
    } catch (err: any) {
      console.error('Error converting lead:', err);
      showToast(err.message || 'Error converting lead', 'error');
    } finally {
      setIsConvertingLead(false);
    }
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Lead Management</h2>
          <p>Track and qualify your incoming sales opportunities.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={() => { setSelectedLead(null); setIsLeadModalOpen(true); }} className="btn-primary">
            <Plus size={16} /> <span>Add Lead</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #70309f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading sales opportunities...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fecaca', margin: '24px 0', padding: '24px' }}>
          <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
          <button className="btn-primary" onClick={fetchLeads}>Try Again</button>
        </div>
      ) : (
        <LeadTable 
          leads={leads} 
          onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }} 
          onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }} 
          onConvert={(l) => { setSelectedLead(l); setIsConvertModalOpen(true); }} 
        />
      )}

      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSave={handleSaveLead} initialData={selectedLead} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => !isDeletingLead && setIsDeleteModalOpen(false)} onConfirm={handleDeleteLead} itemName={selectedLead?.name || ''} isDeleting={isDeletingLead} />
      <ConvertModal isOpen={isConvertModalOpen} onClose={() => !isConvertingLead && setIsConvertModalOpen(false)} onConfirm={handleConvertLead} leadName={selectedLead?.name || ''} isConverting={isConvertingLead} />
    </MainLayout>
  );
};

export default LeadsPage;

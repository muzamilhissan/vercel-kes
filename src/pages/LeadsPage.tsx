import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import LeadTable from '../features/leads/LeadTable';
import LeadKanbanBoard from '../features/leads/LeadKanbanBoard';
import LeadDetailsPageView from '../features/leads/LeadDetailsPageView';
import Loader from '../components/ui/Loader';
import LeadModal from '../features/leads/LeadModal';
import DeleteModal from '../features/leads/DeleteModal';
import ConvertModal from '../features/leads/ConvertModal';
import LeadDetailsModal from '../features/leads/LeadDetailsModal';
import LeadStatsCards from '../features/leads/components/LeadStatsCards';
import LeadsPageHeader from '../features/leads/components/LeadsPageHeader';
import { useLeads } from '../features/leads/hooks/useLeads';

const LeadsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const {
    leads,
    allLeads,
    selectedLead,
    setSelectedLead,
    isLeadModalOpen,
    setIsLeadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isConvertModalOpen,
    setIsConvertModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    loading,
    error,
    isDeletingLead,
    isConvertingLead,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    filterDate,
    setFilterDate,
    viewMode,
    setViewMode,
    viewingLead,
    setViewingLead,
    isInitializingFromUrl,
    fetchLeads,
    handleSaveLead,
    handleDeleteLead,
    handleConvertLead,
    handleAssignLead
  } = useLeads();

  if (isInitializingFromUrl) {
    return (
      <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
        <Loader message="Loading lead details..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      {viewingLead ? (
        <LeadDetailsPageView 
          lead={viewingLead} 
          onBack={() => setViewingLead(null)} 
          onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }}
          onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }}
        />
      ) : (
        <>
          <LeadsPageHeader 
            viewMode={viewMode}
            setViewMode={setViewMode}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            onAddLead={() => { setSelectedLead(null); setIsLeadModalOpen(true); }}
          />

          {loading ? (
            <Loader message="Loading sales opportunities..." />
          ) : error ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '16px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #fecaca', margin: '24px 0', padding: '24px' }}>
              <p style={{ color: '#dc2626', fontWeight: 600 }}>{error}</p>
              <button className="btn-primary" onClick={fetchLeads}>Try Again</button>
            </div>
          ) : (
            <>
              {viewMode === 'kanban' ? (
                <div className="kanban-view-wrapper" style={{ overflowX: 'auto', paddingBottom: '12px' }}>
                  <LeadStatsCards allLeads={allLeads} totalItems={totalItems} viewMode={viewMode} />
                  <LeadKanbanBoard 
                    leads={allLeads}
                    onView={(l) => setViewingLead(l)}
                    onAssign={handleAssignLead}
                  />
                </div>
              ) : (
                <>
                  <LeadStatsCards allLeads={allLeads} totalItems={totalItems} viewMode={viewMode} />
                  <LeadTable 
                  leads={leads} 
                  onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }} 
                  onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }} 
                  onConvert={(l) => { setSelectedLead(l); setIsConvertModalOpen(true); }} 
                  onView={(l) => setViewingLead(l)}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                />
                </>
              )}
            </>
          )}
        </>
      )}

      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSave={handleSaveLead} initialData={selectedLead} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => !isDeletingLead && setIsDeleteModalOpen(false)} onConfirm={handleDeleteLead} itemName={selectedLead?.name || ''} isDeleting={isDeletingLead} />
      <ConvertModal isOpen={isConvertModalOpen} onClose={() => !isConvertingLead && setIsConvertModalOpen(false)} onConfirm={handleConvertLead} leadName={selectedLead?.name || ''} isConverting={isConvertingLead} />
      <LeadDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} lead={selectedLead} />
    </MainLayout>
  );
};

export default LeadsPage;

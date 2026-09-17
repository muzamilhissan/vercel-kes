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
import AssignLeadModal from '../features/leads/components/AssignLeadModal';
import LeadStatsCards from '../features/leads/components/LeadStatsCards';
import LeadsPageHeader from '../features/leads/components/LeadsPageHeader';
import { useLeads } from '../features/leads/hooks/useLeads';

const LeadsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const {
    isSuperAdmin,
    leads,
    allLeads,
    assignableUsers,
    selectedLead,
    setSelectedLead,
    leadToAssign,
    isLeadModalOpen,
    setIsLeadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isConvertModalOpen,
    setIsConvertModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isAssignModalOpen,
    setIsAssignModalOpen,
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
    filterAssignees,
    setFilterAssignees,
    viewMode,
    setViewMode,
    viewingLead,
    setViewingLead,
    isInitializingFromUrl,
    fetchLeads,
    handleSaveLead,
    handleDeleteLead,
    handleConvertLead,
    handleAssignLead,
    openAssignModal
  } = useLeads();

  React.useEffect(() => {
    const handleSidebarNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.path === 'leads') {
        setViewingLead(null);
      }
    };
    window.addEventListener('sidebarNavigate', handleSidebarNav);
    return () => window.removeEventListener('sidebarNavigate', handleSidebarNav);
  }, [setViewingLead]);

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
          isSuperAdmin={isSuperAdmin}
          onBack={() => setViewingLead(null)} 
          onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }}
          onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }}
          onAssign={isSuperAdmin ? openAssignModal : undefined}
        />
      ) : (
        <>
          <LeadsPageHeader 
            viewMode={viewMode}
            setViewMode={setViewMode}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterAssignees={filterAssignees}
            setFilterAssignees={setFilterAssignees}
            assignableUsers={assignableUsers}
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
                <div className="kanban-view-wrapper">
                  <LeadStatsCards allLeads={allLeads} totalItems={totalItems} viewMode={viewMode} />
                  <div className="kanban-board-scroll-container" style={{ overflow: 'visible', paddingBottom: '12px' }}>
                    <LeadKanbanBoard 
                      leads={allLeads}
                      isSuperAdmin={isSuperAdmin}
                      onView={(l) => setViewingLead(l)}
                      onAssign={isSuperAdmin ? openAssignModal : undefined}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <LeadStatsCards allLeads={allLeads} totalItems={totalItems} viewMode={viewMode} />
                  <LeadTable 
                    leads={leads} 
                    isSuperAdmin={isSuperAdmin}
                    onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }} 
                    onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }} 
                    onConvert={(l) => { setSelectedLead(l); setIsConvertModalOpen(true); }} 
                    onView={(l) => setViewingLead(l)}
                    onAssign={isSuperAdmin ? openAssignModal : undefined}
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

      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onSave={handleSaveLead} 
        initialData={selectedLead}
        isSuperAdmin={isSuperAdmin}
        assignableUsers={assignableUsers}
      />
      
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeletingLead && setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteLead} 
        itemName={selectedLead?.name || ''} 
        isDeleting={isDeletingLead} 
      />
      
      <ConvertModal 
        isOpen={isConvertModalOpen} 
        onClose={() => !isConvertingLead && setIsConvertModalOpen(false)} 
        onConfirm={handleConvertLead} 
        leadName={selectedLead?.name || ''} 
        isConverting={isConvertingLead} 
      />
      
      <LeadDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        lead={selectedLead} 
      />

      <AssignLeadModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        lead={leadToAssign}
        assignableUsers={assignableUsers}
        onAssign={handleAssignLead}
      />
    </MainLayout>
  );
};

export default LeadsPage;

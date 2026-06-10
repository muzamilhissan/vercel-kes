import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import LeadTable, { Lead } from '../features/leads/LeadTable';
import LeadModal from '../features/leads/LeadModal';
import DeleteModal from '../features/leads/DeleteModal';
import ConvertModal from '../features/leads/ConvertModal';
import { Plus, Filter, Download } from 'lucide-react';

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'John Doe', company: 'TechFlow', email: 'john@techflow.com', phone: '123-456-7890', status: 'New', dateAdded: 'Oct 10, 2026' },
  { id: '2', name: 'Sarah Smith', company: 'Apex Inc', email: 'sarah@apex.com', phone: '987-654-3210', status: 'Contacted', dateAdded: 'Oct 11, 2026' },
  { id: '3', name: 'Mike Johnson', company: 'Global Solutions', email: 'mike@global.com', phone: '555-0199', status: 'Qualified', dateAdded: 'Oct 09, 2026' },
];

const LeadsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const handleSaveLead = (lead: Lead) => {
    if (selectedLead) setLeads(leads.map(l => l.id === lead.id ? lead : l));
    else setLeads([...leads, lead]);
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = () => {
    setLeads(leads.filter(l => l.id !== selectedLead?.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Lead Management</h2>
          <p>Track and qualify your incoming sales opportunities.</p>
        </div>
        <div className="page-header-actions">
          <button className="filter-chip"><Download size={16} /> Export</button>
          <button onClick={() => { setSelectedLead(null); setIsLeadModalOpen(true); }} className="btn-primary">
            <Plus size={16} /> <span>Add Lead</span>
          </button>
        </div>
      </div>

      <LeadTable leads={leads} onEdit={(l) => { setSelectedLead(l); setIsLeadModalOpen(true); }} onDelete={(l) => { setSelectedLead(l); setIsDeleteModalOpen(true); }} onConvert={(l) => { setSelectedLead(l); setIsConvertModalOpen(true); }} />

      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSave={handleSaveLead} initialData={selectedLead} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteLead} itemName={selectedLead?.name || ''} />
      <ConvertModal isOpen={isConvertModalOpen} onClose={() => setIsConvertModalOpen(false)} onConfirm={() => { setLeads(leads.filter(l => l.id !== selectedLead?.id)); setIsConvertModalOpen(false); }} leadName={selectedLead?.name || ''} />
    </MainLayout>
  );
};

export default LeadsPage;

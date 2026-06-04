import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Deal } from './KanbanCard';
import DealModal from './DealModal';
import DealDetailsModal from './DealDetailsModal';
import './PipelineBoard.css';

const INITIAL_DEALS: Deal[] = [
  { 
    id: 'KDN-482', name: 'Commercial HVAC Installation', account: 'Prestige Plaza', value: 85000, closeDate: 'Oct 28, 2026', 
    stage: 'Backlog Tasks', tags: [{ text: 'Mechanical', color: '#3b82f6' }, { text: 'High Priority', color: '#ef4444' }], 
    notesCount: 5, filesCount: 12, avatars: ['https://api.dicebear.com/7.x/avataaars/svg?seed=John', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'],
    bgColor: '#fdf4ff'
  },
  { 
    id: 'KDN-109', name: 'Structural Safety Audit', account: 'Metro Rail Corp', value: 12500, closeDate: 'Nov 12, 2026', 
    stage: 'Backlog Tasks', tags: [{ text: 'Civil', color: '#ec4899' }], 
    notesCount: 2, filesCount: 4, avatars: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'],
    bgColor: '#f0f9ff'
  },
  { 
    id: 'KDN-732', name: 'Industrial Power Grid Upgrade', account: 'National Energy', value: 450000, closeDate: 'Dec 05, 2026', 
    stage: 'To Do Tasks', tags: [{ text: 'Electrical', color: '#a855f7' }, { text: 'Enterprise', color: '#f59e0b' }], 
    notesCount: 15, filesCount: 8, avatars: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'],
    bgColor: '#fffbeb'
  },
  { 
    id: 'KDN-221', name: 'Water Filtration System', account: 'Green Valley', value: 35000, closeDate: 'Oct 15, 2026', 
    stage: 'In Process', tags: [{ text: 'Environmental', color: '#14b8a6' }], 
    notesCount: 8, filesCount: 2, avatars: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara'],
    bgColor: '#f0fdf4'
  },
  { 
    id: 'KDN-554', name: 'Bridge Maintenance Contract', account: 'City Council', value: 92000, closeDate: 'Sep 30, 2026', 
    stage: 'Done', tags: [{ text: 'Maintenance', color: '#10b981' }], 
    notesCount: 22, filesCount: 15, avatars: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'],
    bgColor: '#fdf2f2'
  }
];

const PipelineBoard: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSaveDeal = (deal: Deal) => {
    if (deals.find(d => d.id === deal.id)) setDeals(deals.map(d => d.id === deal.id ? deal : d));
    else setDeals([...deals, deal]);
    setIsEditModalOpen(false);
  };

  const getDealsByStage = (stage: string) => deals.filter(deal => deal.stage === stage);

  return (
    <div className="pipeline-board">
      {['Backlog Tasks', 'To Do Tasks', 'In Process', 'Done'].map(stage => (
        <KanbanColumn 
          key={stage} title={stage} count={getDealsByStage(stage).length} 
          deals={getDealsByStage(stage)} color={stage === 'Done' ? '#10b981' : stage === 'In Process' ? '#a855f7' : stage === 'To Do Tasks' ? '#ec4899' : '#f59e0b'}
          onCardClick={(d) => { setSelectedDeal(d); setIsDetailsModalOpen(true); }}
          onAddCard={(s) => { setSelectedDeal(null); setIsEditModalOpen(true); }}
        />
      ))}
      <DealModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveDeal} initialData={selectedDeal} />
      {selectedDeal && (
        <DealDetailsModal 
          isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} 
          deal={selectedDeal} onAddNote={(id, note) => console.log(note)} 
        />
      )}
    </div>
  );
};

export default PipelineBoard;

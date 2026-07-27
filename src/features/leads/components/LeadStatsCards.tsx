import React, { useMemo } from 'react';
import { Users, UserPlus, PhoneForwarded, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Lead } from '../LeadTable';
import './LeadStatsCards.css';

interface LeadStatsCardsProps {
  allLeads: Lead[];
  totalItems: number;
  viewMode?: string;
}

const LeadStatsCards: React.FC<LeadStatsCardsProps> = ({ allLeads, totalItems, viewMode }) => {
  const stats = useMemo(() => {
    let newCount = 0;
    let contactedCount = 0;
    let proposedCount = 0;
    let qualifiedCount = 0;
    let lostCount = 0;

    allLeads.forEach(lead => {
      const status = (lead.status || '').toLowerCase();
      if (status === 'new') newCount++;
      else if (status === 'contacted') contactedCount++;
      else if (status === 'proposed') proposedCount++;
      else if (status === 'qualified') qualifiedCount++;
      else if (status === 'disqualified') lostCount++;
    });

    return {
      new: newCount,
      contacted: contactedCount,
      proposed: proposedCount,
      qualified: qualifiedCount,
      lost: lostCount,
    };
  }, [allLeads]);

  const renderCards = () => (
    <>
      <div className="stat-card total">
        <div className="stat-card-header">
          <span className="stat-card-title">Total Leads</span>
          <div className="stat-card-icon"><Users size={14} /></div>
        </div>
        <span className="stat-card-value">{totalItems > 0 ? totalItems : allLeads.length}</span>
      </div>
      <div className="stat-card new">
        <div className="stat-card-header">
          <span className="stat-card-title">New</span>
          <div className="stat-card-icon"><UserPlus size={14} /></div>
        </div>
        <span className="stat-card-value">{stats.new}</span>
      </div>
      <div className="stat-card contacted">
        <div className="stat-card-header">
          <span className="stat-card-title">Contacted</span>
          <div className="stat-card-icon"><PhoneForwarded size={14} /></div>
        </div>
        <span className="stat-card-value">{stats.contacted}</span>
      </div>
      <div className="stat-card proposed">
        <div className="stat-card-header">
          <span className="stat-card-title">Proposed</span>
          <div className="stat-card-icon"><FileText size={14} /></div>
        </div>
        <span className="stat-card-value">{stats.proposed}</span>
      </div>
      <div className="stat-card qualified">
        <div className="stat-card-header">
          <span className="stat-card-title">Qualified</span>
          <div className="stat-card-icon"><CheckCircle2 size={14} /></div>
        </div>
        <span className="stat-card-value">{stats.qualified}</span>
      </div>
      <div className="stat-card disqualified">
        <div className="stat-card-header">
          <span className="stat-card-title">Disqualified</span>
          <div className="stat-card-icon"><XCircle size={14} /></div>
        </div>
        <span className="stat-card-value">{stats.lost}</span>
      </div>
    </>
  );

  if (viewMode !== 'kanban') {
    return <div className="stats-cards-container">{renderCards()}</div>;
  }

  return (
    <div className="stats-cards-container kanban-aligned">
      {renderCards()}
    </div>
  );
};

export default LeadStatsCards;

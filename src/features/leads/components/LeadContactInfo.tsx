import React from 'react';
import { Lead } from '../LeadTable';
import { Contact2 } from 'lucide-react';

interface LeadContactInfoProps {
  lead: Lead;
}

const LeadContactInfo: React.FC<LeadContactInfoProps> = ({ lead }) => {
  return (
    <div className="lead-details-card">
      <div className="card-header">
        <Contact2 size={16} className="header-icon" />
        <h3>Contact Information</h3>
      </div>
      <div className="card-body highlighted-body">
        <div className="info-row">
          <span className="info-label">Client Name:</span>
          <span className="info-value">Kudon Engineering Services</span>
        </div>
        <div className="info-row">
          <span className="info-label">Contact Person:</span>
          <span className="info-value">{lead.name}</span>
        </div>
        {lead.representative_position && (
          <div className="info-row">
            <span className="info-label">Position:</span>
            <span className="info-value">{lead.representative_position}</span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">Email:</span>
          <a href={`mailto:${lead.email}`} className="info-value link">{lead.email}</a>
        </div>
        <div className="info-row">
          <span className="info-label">Phone:</span>
          <a href={`tel:${lead.phone}`} className="info-value link">{lead.phone}</a>
        </div>
        <div className="info-row">
          <span className="info-label">Website:</span>
          {lead.website ? (
            <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="info-value link">
              {lead.website}
            </a>
          ) : (
            <span className="info-value">N/A</span>
          )}
        </div>
        <div className="info-row">
          <span className="info-label">Source:</span>
          <span className="info-value">{lead.source || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadContactInfo;

import React from 'react';
import { MoreHorizontal, Calendar, DollarSign, Paperclip, MessageSquare, Plus } from 'lucide-react';
import './KanbanCard.css';

export interface Deal {
  id: string;
  name: string;
  account: string;
  value: number;
  closeDate: string;
  stage: string;
  priority?: 'High' | 'Medium' | 'Low';
  tags: { text: string; color: string }[];
  notesCount: number;
  filesCount: number;
  avatars: string[];
  bgColor?: string;
}

interface KanbanCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

import { CheckSquare } from 'lucide-react';

const KanbanCard: React.FC<KanbanCardProps> = ({ deal, onClick }) => {
  return (
    <div className="kanban-card" onClick={() => onClick(deal)} style={{ backgroundColor: deal.bgColor || '#ffffff' }}>
      <div className="card-top">
        <h4 className="deal-name">{deal.name}</h4>
        <div className="status-icon-box">
          <CheckSquare size={16} color="#fff" fill="#3b82f6" />
          <span className="status-number">{deal.filesCount}</span>
        </div>
      </div>

      <div className="card-tags">
        <span className="id-tag">{deal.id}</span>
        {deal.tags.map((tag, i) => (
          <span key={i} className="feature-tag" style={{ backgroundColor: `${tag.color}12`, color: tag.color }}>
            {tag.text}
          </span>
        ))}
      </div>

      <div className="card-bottom">
        <div className="avatar-group">
          {deal.avatars.slice(0, 3).map((url, i) => (
            <img key={i} src={url} alt="member" className="stacked-avatar" />
          ))}
          {deal.avatars.length > 3 && (
            <div className="avatar-plus">+{deal.avatars.length - 3}</div>
          )}
          <div className="add-member-btn">
            <Plus size={14} />
          </div>
        </div>
        
        <div className="card-meta">
          <div className="meta-item"><Paperclip size={13} /> <span>{deal.filesCount}</span></div>
          <div className="meta-item"><MessageSquare size={13} /> <span>{deal.notesCount}</span></div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;

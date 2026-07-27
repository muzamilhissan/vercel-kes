import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import KanbanCard, { Deal } from './KanbanCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  title: string;
  count: number;
  deals: Deal[];
  color: string;
  onCardClick: (deal: Deal) => void;
  onAddCard: (stage: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, count, deals, color, onCardClick, onAddCard }) => {
  return (
    <div className="kanban-column">
      <div className="column-header" style={{ borderTopColor: color }}>
        <div className="column-header-left">
          <h3 className="column-title">{title}</h3>
          <span className="column-count" style={{ backgroundColor: `${color}20`, color: color }}>{count}</span>
        </div>
        <div className="header-actions">
          <MoreHorizontal size={18} className="icon-btn" />
        </div>
      </div>

      <div className="column-content">
        {deals.map(deal => (
          <KanbanCard key={deal.id} deal={deal} onClick={onCardClick} />
        ))}
        <div className="add-task-btn" onClick={() => onAddCard(title)}>
          <Plus size={20} />
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;

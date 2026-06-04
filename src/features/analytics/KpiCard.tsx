import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './KpiCard.css';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isPositive, icon, color }) => (
  <div className="kpi-card" style={{ color: color }}>
    <div className="kpi-top">
      <div className="kpi-icon-box" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="kpi-body">
      <p className="kpi-title">{title}</p>
      <h3 className="kpi-value">{value}</h3>
    </div>
  </div>
);

export default KpiCard;

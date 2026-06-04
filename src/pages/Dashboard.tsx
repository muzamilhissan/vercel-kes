import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import PipelineBoard from '../features/kanban/PipelineBoard';
import './Dashboard.css';

interface DashboardProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

import { Edit2, LayoutGrid, List } from 'lucide-react';

const Dashboard: React.FC<DashboardProps> = ({ currentPath, onNavigate }) => {
  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="dashboard-content-header">
        <div className="title-row">
          <h2 className="page-main-title">Task Boards</h2>
          <Edit2 size={18} className="edit-icon" />
          
          <div className="view-controls" style={{ marginLeft: 'auto' }}>
            <div className="view-toggle">
              <div className="toggle-item active">
                <LayoutGrid size={16} />
                <span>Board View</span>
              </div>
              <div className="toggle-item">
                <List size={16} />
                <span>List View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PipelineBoard />
    </MainLayout>
  );
};

export default Dashboard;

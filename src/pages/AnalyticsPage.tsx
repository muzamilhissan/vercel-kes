import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import KpiCard from '../features/analytics/KpiCard';
import ReportCard from '../features/analytics/ReportCard';
import { Users, DollarSign, Briefcase, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsPage: React.FC<{currentPath: string; onNavigate: (path: string) => void}> = ({ currentPath, onNavigate }) => {


  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="analytics-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b' }}>Reporting & Analytics</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Comprehensive insights into your sales pipeline and performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
        </div>
      </div>

      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <KpiCard title="Total Revenue" value="$142,500" change="+12.5%" isPositive={true} icon={<DollarSign size={20} />} color="#70309f" />
        <KpiCard title="Active Leads" value="84" change="+18.2%" isPositive={true} icon={<Users size={20} />} color="#0369a1" />
        <KpiCard title="Open Deals" value="26" change="-4.3%" isPositive={false} icon={<Briefcase size={20} />} color="#b45309" />
        <KpiCard title="Conversion Rate" value="24.8%" change="+2.4%" isPositive={true} icon={<TrendingUp size={20} />} color="#059669" />
      </div>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <ReportCard title="Leads by Status" onExport={() => {}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[ {s: 'New', c: 32, cl: '#70309f'}, {s: 'Contacted', c: 24, cl: '#b45309'}, {s: 'Qualified', c: 18, cl: '#0369a1'}, {s: 'Converted', c: 10, cl: '#059669'} ].map(i => (
              <div key={i.s} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>{i.s}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{i.c}</span>
                </div>
                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(i.c/32)*100}%`, 
                    height: '100%', 
                    background: i.cl,
                    boxShadow: `0 0 12px ${i.cl}40`,
                    borderRadius: '5px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </ReportCard>

        <ReportCard title="Deals Won vs Lost" onExport={() => {}}>
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#059669', letterSpacing: '-0.03em' }}>18</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Won Deals</div>
              <div style={{ fontSize: '14px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>$94,200 total</div>
            </div>
            <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, #e2e8f0, transparent)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '42px', fontWeight: 900, color: '#ef4444', letterSpacing: '-0.03em' }}>6</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lost Deals</div>
              <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>$22,500 total</div>
            </div>
          </div>
        </ReportCard>

        <ReportCard title="Open Deals List" onExport={() => {}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ textAlign: 'left', color: '#94a3b8' }}><th style={{ paddingBottom: '12px' }}>DEAL NAME</th><th style={{ paddingBottom: '12px' }}>VALUE</th><th style={{ paddingBottom: '12px' }}>STAGE</th></tr></thead>
            <tbody>
              {[ {n: 'HVAC Upgrade', v: '$12,500', s: 'Qualified'}, {n: 'Solar Install', v: '$45,000', s: 'In Process'}, {n: 'Roofing Project', v: '$8,200', s: 'New'} ].map(d => (
                <tr key={d.n}><td style={{ padding: '10px 0', fontWeight: 600 }}>{d.n}</td><td>{d.v}</td><td><span style={{ padding: '4px 8px', borderRadius: '6px', background: '#f1f5f9', fontSize: '11px' }}>{d.s}</span></td></tr>
              ))}
            </tbody>
          </table>
        </ReportCard>

        <ReportCard title="Contacts Added" onExport={() => {}}>
           <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#70309f' }}>42</div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>New professional contacts established in this period.</p>
           </div>
        </ReportCard>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;

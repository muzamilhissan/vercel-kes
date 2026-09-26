import { BarChart3 } from 'lucide-react';
import { DetailCard } from './DetailCard';

/** Engagement counters. The API does not expose these yet, so both read zero. */
const STATS = [
  { label: 'Emails Sent', value: 0, className: 'text-emerald-500' },
  { label: 'Responses', value: 0, className: 'text-blue-500' },
];

export function LeadEngagementStats() {
  return (
    <DetailCard icon={BarChart3} title="Engagement Stats">
      <div className="flex gap-4 rounded-lg bg-surface-muted p-6">
        {STATS.map(({ label, value, className }) => (
          <div key={label} className="flex-1">
            <p className={`mb-1 text-[1.75rem] font-bold ${className}`}>{value}</p>
            <p className="text-label text-ink-muted">{label}</p>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}

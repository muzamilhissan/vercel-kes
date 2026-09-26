import { Clock } from 'lucide-react';
import { DetailCard } from './DetailCard';
import type { Lead } from '../../types';

export function LeadActivityTimeline({ lead }: { lead: Lead }) {
  return (
    <DetailCard icon={Clock} title="Activity Timeline">
      <ol>
        <li className="border-l-[3px] border-blue-500 pl-4">
          <div className="mb-1 flex justify-between">
            <strong className="text-sm text-ink">System</strong>
            <span className="text-xs text-ink-subtle">{lead.dateAdded || 'N/A'}</span>
          </div>
          <p className="text-label text-ink-muted">Lead created</p>
        </li>
      </ol>
    </DetailCard>
  );
}

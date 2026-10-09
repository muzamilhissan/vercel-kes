import { Clock } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/format';
import { toLeadStatus, type LeadStatus } from '../../constants';
import { DetailCard } from './DetailCard';
import type { Lead } from '../../types';

const BORDER: Record<LeadStatus, string> = {
  New: 'border-blue-500',
  Contacted: 'border-amber-500',
  Proposed: 'border-sky-500',
  Qualified: 'border-green-500',
  Disqualified: 'border-red-500',
  Converted: 'border-purple-500',
};

export function LeadActivityTimeline({ lead }: { lead: Lead }) {
  const history = [...(lead.history ?? [])].sort((a, b) =>
    String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')),
  );

  if (history.length === 0) {
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

  return (
    <DetailCard icon={Clock} title="Activity Timeline">
      <ol className="flex flex-col gap-4">
        {history.map((entry, index) => {
          const status = toLeadStatus(entry.status);
          const isOrigin = index === history.length - 1 && status === 'New';

          return (
            <li key={entry.id} className={cn('border-l-[3px] pl-4', BORDER[status])}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <strong className="text-sm text-ink">{entry.user?.name || 'System'}</strong>
                <span className="text-xs text-ink-subtle">{formatDateTime(entry.created_at)}</span>
              </div>
              <p className="text-label text-ink-muted">
                {isOrigin ? (
                  'Lead created'
                ) : (
                  <>
                    Status changed to <span className="font-semibold text-ink">{status}</span>
                  </>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </DetailCard>
  );
}

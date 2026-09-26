import { cn } from '@/shared/lib/cn';
import { STATUS_CLASSES, toLeadStatus } from '../../../constants';

export function LeadStatusBadge({ status, className }: { status: string | undefined; className?: string }) {
  const normalized = toLeadStatus(status);
  return (
    <span className={cn('inline-block rounded-[0.625rem] px-3 py-1.5 text-xs font-bold', STATUS_CLASSES[normalized], className)}>
      {normalized}
    </span>
  );
}

import { cn } from '@/shared/lib/cn';
import { assigneesOf } from '../../../lib/assignees';
import type { Lead } from '../../../types';

const MAX_AVATARS = 3;

interface AssigneeCellProps {
  lead: Lead;
  canAssign: boolean;
  onAssign?: (lead: Lead) => void;
}

/** Stacked avatars for a lead's assignees; admins can click through to reassign. */
export function AssigneeCell({ lead, canAssign, onAssign }: AssigneeCellProps) {
  const assignees = assigneesOf(lead);
  const Wrapper = canAssign && onAssign ? 'button' : 'div';

  const wrapperProps =
    canAssign && onAssign
      ? {
          type: 'button' as const,
          onClick: (event: React.MouseEvent) => {
            event.stopPropagation();
            onAssign(lead);
          },
          title: assignees.length ? 'Click to assign / reassign' : 'Click to assign lead',
        }
      : { title: assignees.map((assignee) => assignee.fullName || assignee.name).join(', ') || 'Unassigned' };

  if (assignees.length === 0) {
    return (
      <Wrapper
        {...wrapperProps}
        className={cn(
          'inline-block rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-ink-muted',
          canAssign && 'cursor-pointer hover:border-brand hover:text-brand',
        )}
      >
        {canAssign ? '+ Assign' : 'Unassigned'}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-field px-2 py-1 text-xs font-semibold text-slate-700',
        canAssign && 'cursor-pointer hover:bg-brand-50 hover:text-brand',
      )}
    >
      <span className="flex -space-x-2">
        {assignees.slice(0, MAX_AVATARS).map((assignee) => (
          <img
            key={assignee.id}
            src={assignee.avatar}
            alt=""
            className="size-6 rounded-full border-2 border-white object-cover"
          />
        ))}
      </span>
      <span className="ml-1 truncate">
        {assignees[0].fullName || assignees[0].name}
        {assignees.length > 1 && ` +${assignees.length - 1}`}
      </span>
    </Wrapper>
  );
}

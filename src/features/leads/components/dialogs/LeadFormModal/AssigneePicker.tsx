import { Check, UserPlus } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { assigneeAvatar, type LeadAssignee } from '../../../lib/assignees';

interface AssigneePickerProps {
  users: LeadAssignee[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

/** Multi-select chips for assigning a lead; admin-only in the form. */
export function AssigneePicker({ users, selectedIds, onChange, disabled }: AssigneePickerProps) {
  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((entry) => entry !== id) : [...selectedIds, id]);

  return (
    <fieldset disabled={disabled}>
      <legend className="mb-3 flex items-center gap-1.5 text-label font-bold tracking-wide text-slate-600">
        <UserPlus size={14} className="text-brand" />
        Assign To
        <span className="text-2xs font-normal text-ink-muted">({selectedIds.length} selected)</span>
      </legend>

      <div className="scrollbar-thin flex max-h-[8.125rem] flex-wrap gap-2 overflow-y-auto rounded-[0.625rem] border-[1.5px] border-line bg-surface-muted p-2.5">
        {users.map((user) => {
          const isSelected = selectedIds.includes(user.id);
          return (
            <button
              key={user.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(user.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                isSelected
                  ? 'border-brand bg-brand text-white'
                  : 'border-slate-300 bg-surface text-slate-700 hover:border-brand hover:text-brand',
              )}
            >
              <img
                src={user.avatar || assigneeAvatar(user.fullName || user.name)}
                alt=""
                className="size-[1.125rem] rounded-full object-cover"
              />
              {user.fullName || user.name}
              {isSelected && <Check size={12} strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

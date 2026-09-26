import { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Button, CONTROL_BASE, Modal } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import type { User } from '@/shared/types/api';
import { assigneesOf, normalizeAssignee, type LeadAssignee } from '../../lib/assignees';
import type { Lead } from '../../types';

interface AssignLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  assignableUsers: User[];
  isPending: boolean;
  onAssign: (lead: Lead, userIds: string[]) => Promise<unknown>;
}

export function AssignLeadModal({
  open,
  onOpenChange,
  lead,
  assignableUsers,
  isPending,
  onAssign,
}: AssignLeadModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const users = useMemo(
    () => assignableUsers.map(normalizeAssignee).filter((user): user is LeadAssignee => user !== null),
    [assignableUsers],
  );

  useEffect(() => {
    if (!open || !lead) return;
    setSelectedIds(assigneesOf(lead).map((assignee) => assignee.id));
    setSearch('');
  }, [open, lead]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) =>
      [user.name, user.fullName, user.email, user.designation].some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [users, search]);

  const toggle = (id: string) =>
    setSelectedIds((previous) => (previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id]));

  const save = async () => {
    if (!lead) return;
    await onAssign(lead, selectedIds);
    onOpenChange(false);
  };

  if (!lead) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Lead"
      description={lead.name}
      dismissible={!isPending}
      footer={
        <>
          <Button variant="subtle" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={save}>
            {isPending ? 'Saving...' : `Assign (${selectedIds.length})`}
          </Button>
        </>
      }
    >
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or role..."
          className={cn(CONTROL_BASE, 'pl-10')}
        />
      </div>

      <ul className="scrollbar-thin flex max-h-[20rem] flex-col gap-1.5 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="py-10 text-center text-sm text-ink-subtle">No people match that search.</li>
        ) : (
          filtered.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            return (
              <li key={user.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(user.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all',
                    isSelected
                      ? 'border-brand bg-brand-50'
                      : 'border-transparent bg-surface-muted hover:border-line hover:bg-field',
                  )}
                >
                  <img src={user.avatar} alt="" className="size-9 rounded-full object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{user.fullName || user.name}</span>
                    <span className="block truncate text-xs text-ink-muted">{user.designation || user.email}</span>
                  </span>
                  {isSelected && (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </Modal>
  );
}

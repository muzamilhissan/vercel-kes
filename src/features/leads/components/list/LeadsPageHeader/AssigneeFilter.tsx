import { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Filter, Search } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { LeadAssignee } from '../../../lib/assignees';

interface AssigneeFilterProps {
  assignees: LeadAssignee[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** Multi-select popover used to narrow the lead list to particular owners. */
export function AssigneeFilter({ assignees, selectedIds, onChange }: AssigneeFilterProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return assignees;
    return assignees.filter((assignee) =>
      [assignee.name, assignee.fullName, assignee.email].some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [assignees, search]);

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((entry) => entry !== id) : [...selectedIds, id]);

  return (
    <Popover.Root>
      <Popover.Trigger className="flex h-10 items-center gap-1.5 rounded-field border-[1.5px] border-line bg-surface px-3 text-sm font-medium text-ink-muted transition-all hover:border-brand hover:text-brand">
        <Filter size={16} />
        Filter
        {selectedIds.length > 0 && (
          <span className="grid size-[1.125rem] place-items-center rounded-full bg-brand text-2xs text-white">
            {selectedIds.length}
          </span>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-2100 w-[17.5rem] overflow-hidden rounded-xl border border-line bg-surface shadow-panel"
        >
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            <Search size={15} className="shrink-0 text-ink-subtle" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search people..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
            />
          </div>

          <div className="scrollbar-thin max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-subtle">No people found.</p>
            ) : (
              filtered.map((assignee) => (
                <label
                  key={assignee.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-brand-50',
                    selectedIds.includes(assignee.id) && 'font-semibold text-brand',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(assignee.id)}
                    onChange={() => toggle(assignee.id)}
                    className="size-4 accent-brand"
                  />
                  <img src={assignee.avatar} alt="" className="size-6 rounded-full object-cover" />
                  <span className="truncate">{assignee.fullName || assignee.name}</span>
                </label>
              ))
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="border-t border-line p-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full rounded-lg py-1.5 text-sm font-semibold text-ink-muted hover:bg-field hover:text-ink"
              >
                Clear all
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

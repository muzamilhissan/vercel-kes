import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button, DateFilter, PageHeader } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import type { LeadAssignee } from '../../../lib/assignees';
import { AssigneeFilter } from './AssigneeFilter';

export type LeadViewMode = 'kanban' | 'list';

const VIEWS: Array<{ mode: LeadViewMode; label: string; icon: typeof List }> = [
  { mode: 'kanban', label: 'Board view', icon: LayoutGrid },
  { mode: 'list', label: 'List view', icon: List },
];

interface LeadsPageHeaderProps {
  viewMode: LeadViewMode;
  onViewModeChange: (mode: LeadViewMode) => void;
  filterDate: string;
  onFilterDateChange: (date: string) => void;
  filterAssignees: string[];
  onFilterAssigneesChange: (ids: string[]) => void;
  assignees: LeadAssignee[];
  onAddLead: () => void;
}

export function LeadsPageHeader({
  viewMode,
  onViewModeChange,
  filterDate,
  onFilterDateChange,
  filterAssignees,
  onFilterAssigneesChange,
  assignees,
  onAddLead,
}: LeadsPageHeaderProps) {
  return (
    <PageHeader
      title="Lead Management"
      subtitle="Track and qualify your incoming sales opportunities."
      actions={
        <>
          {assignees.length > 0 && (
            <AssigneeFilter
              assignees={assignees}
              selectedIds={filterAssignees}
              onChange={onFilterAssigneesChange}
            />
          )}

          <DateFilter value={filterDate} onChange={onFilterDateChange} />

          <div role="group" aria-label="View mode" className="flex gap-1 rounded-field border-[1.5px] border-line bg-surface p-1">
            {VIEWS.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={viewMode === mode}
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  'grid size-8 place-items-center rounded-lg transition-all',
                  viewMode === mode ? 'bg-brand text-white' : 'text-ink-muted hover:bg-field hover:text-brand',
                )}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          <Button onClick={onAddLead}>
            <Plus size={16} />
            Add Lead
          </Button>
        </>
      }
    />
  );
}

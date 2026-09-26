import { Edit2, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { AssigneeCell } from './AssigneeCell';
import { LeadStatusBadge } from './LeadStatusBadge';
import type { Lead } from '../../../types';

type SortKey = 'name' | 'company' | 'email' | 'phone';

const ACCESSORS: Record<SortKey, (lead: Lead) => string> = {
  name: (lead) => (lead.name ?? '').toLowerCase(),
  company: (lead) => (lead.company ?? '').toLowerCase(),
  email: (lead) => (lead.email ?? '').toLowerCase(),
  phone: (lead) => lead.phone ?? '',
};

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onAssign?: (lead: Lead) => void;
}

export function LeadTable({
  leads,
  isLoading,
  isSuperAdmin,
  onView,
  onEdit,
  onDelete,
  onConvert,
  onAssign,
}: LeadTableProps) {
  const { sorted, sort, toggle } = useSortable<Lead, SortKey>(leads, ACCESSORS);

  const columns: Column<Lead>[] = [
    { id: 'name', header: 'Name', sortable: true, cell: (lead) => <span className="font-semibold">{lead.name}</span> },
    { id: 'company', header: 'Company', sortable: true, className: 'text-ink-muted', cell: (lead) => lead.company },
    { id: 'email', header: 'Email', sortable: true, cell: (lead) => lead.email },
    { id: 'phone', header: 'Phone Number', sortable: true, cell: (lead) => lead.phone },
    { id: 'status', header: 'Status', cell: (lead) => <LeadStatusBadge status={lead.status} /> },
    {
      id: 'assigned',
      header: 'Assigned To',
      cell: (lead) => <AssigneeCell lead={lead} canAssign={isSuperAdmin && Boolean(onAssign)} onAssign={onAssign} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (lead) => {
        const isConverted = lead.status === 'Converted';
        return (
          <div className="flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>
            {isSuperAdmin && onAssign && (
              <IconButton label="Assign / reassign lead" onClick={() => onAssign(lead)}>
                <UserCheck size={16} />
              </IconButton>
            )}
            <IconButton label="Edit lead" onClick={() => onEdit(lead)}>
              <Edit2 size={16} />
            </IconButton>
            <IconButton label="Delete lead" className="text-red-500" onClick={() => onDelete(lead)}>
              <Trash2 size={16} />
            </IconButton>
            <IconButton
              label={isConverted ? 'Already converted to contact' : 'Convert to contact'}
              className={isConverted ? undefined : 'text-emerald-500'}
              disabled={isConverted}
              onClick={() => onConvert(lead)}
            >
              <UserPlus size={16} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={sorted}
      rowKey={(lead) => lead.id}
      isLoading={isLoading}
      onRowClick={onView}
      sort={sort}
      onSort={(key) => toggle(key as SortKey)}
      minWidth="62.5rem"
      emptyMessage='No leads found. Click "Add Lead" to get started!'
    />
  );
}

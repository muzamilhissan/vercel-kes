import { Eye } from 'lucide-react';
import { DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { capitalize } from '@/shared/lib/text';
import { formatDate } from '@/shared/lib/format';
import type { Lead } from '@/features/leads/types';

type SortKey = 'name' | 'company' | 'industry' | 'converted_at';

const ACCESSORS: Record<SortKey, (lead: Lead) => string> = {
  name: (lead) => (lead.name ?? '').toLowerCase(),
  company: (lead) => (lead.company ?? '').toLowerCase(),
  industry: (lead) => (lead.industry ?? '').toLowerCase(),
  converted_at: (lead) => lead.converted_at ?? '',
};

interface ConvertedLeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
}

export function ConvertedLeadTable({ leads, isLoading, onView }: ConvertedLeadTableProps) {
  const { sorted, sort, toggle } = useSortable<Lead, SortKey>(leads, ACCESSORS);

  const columns: Column<Lead>[] = [
    {
      id: 'name',
      header: 'Contact Person',
      sortable: true,
      cell: (lead) => <span className="font-semibold">{capitalize(lead.name)}</span>,
    },
    {
      id: 'company',
      header: 'Client Name',
      sortable: true,
      className: 'text-ink-muted',
      cell: (lead) => (lead.company ? capitalize(lead.company) : 'N/A'),
    },
    {
      id: 'industry',
      header: 'Industry',
      sortable: true,
      className: 'text-ink-muted',
      cell: (lead) => (lead.industry ? capitalize(lead.industry) : 'N/A'),
    },
    { id: 'email', header: 'Email', cell: (lead) => lead.email || 'N/A' },
    { id: 'phone', header: 'Phone', cell: (lead) => lead.phone || 'N/A' },
    {
      id: 'converted_at',
      header: 'Converted',
      sortable: true,
      className: 'text-ink-muted',
      cell: (lead) => formatDate(lead.converted_at ?? undefined),
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (lead) => (
        <div className="flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>
          <IconButton label={`View ${lead.name}`} onClick={() => onView(lead)}>
            <Eye size={16} />
          </IconButton>
        </div>
      ),
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
      emptyMessage="No converted leads yet. Convert a qualified lead to see it here."
    />
  );
}

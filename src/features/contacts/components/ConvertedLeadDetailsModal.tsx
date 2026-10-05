import { DetailList, Modal } from '@/shared/ui';
import { capitalize } from '@/shared/lib/text';
import { formatDate } from '@/shared/lib/format';
import type { Lead } from '@/features/leads/types';

const randValue = (value: number | undefined) =>
  value === undefined || Number.isNaN(Number(value)) ? 'N/A' : `R ${Number(value).toLocaleString()}`;

interface ConvertedLeadDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function ConvertedLeadDetailsModal({ open, onOpenChange, lead }: ConvertedLeadDetailsModalProps) {
  if (!lead) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Converted Client"
      description={`Original lead data for ${lead.name}`}
      size="lg"
    >
      <section className="flex flex-col gap-2">
        <h4 className="text-label font-semibold text-slate-600">Contact</h4>
        <DetailList
          columns={2}
          items={[
            { label: 'Client Name', value: capitalize(lead.name) },
            { label: 'Company', value: lead.company ? capitalize(lead.company) : 'N/A' },
            { label: 'Position', value: lead.representative_position || 'N/A' },
            { label: 'Email', value: lead.email || 'N/A', breakAll: true },
            { label: 'Phone', value: lead.phone || 'N/A' },
            { label: 'Website', value: lead.website || 'N/A', breakAll: true },
          ]}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="text-label font-semibold text-slate-600">Lead Details</h4>
        <DetailList
          columns={2}
          items={[
            { label: 'Industry', value: lead.industry || 'N/A' },
            { label: 'Province', value: lead.province || 'N/A' },
            { label: 'Source', value: lead.source || 'N/A' },
            { label: 'Expected Revenue', value: randValue(lead.expected_revenue) },
            { label: 'Probability', value: lead.probability === undefined ? 'N/A' : `${lead.probability}%` },
            { label: 'Converted On', value: formatDate(lead.converted_at ?? undefined) },
          ]}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="text-label font-semibold text-slate-600">Billing &amp; Registration</h4>
        <DetailList
          columns={2}
          items={[
            { label: 'VAT Number', value: lead.vat_number || 'N/A' },
            { label: 'Vendor Number', value: lead.vendor_number || 'N/A' },
            { label: 'Registration No.', value: lead.registration_no || 'N/A' },
            { label: 'Enduser Name', value: lead.enduser_name || 'N/A' },
            { label: 'Finance Email', value: lead.finance_email || 'N/A', breakAll: true },
            { label: 'Billing Statement Email', value: lead.billing_statement_email || 'N/A', breakAll: true },
            { label: 'Address', value: lead.address || 'N/A' },
          ]}
        />
      </section>

      {lead.notes && (
        <section className="flex flex-col gap-1">
          <h4 className="text-label font-semibold text-slate-600">Notes</h4>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{lead.notes}</p>
        </section>
      )}
    </Modal>
  );
}

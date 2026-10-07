import { Contact2, Mail, Phone } from 'lucide-react';
import { Button, Modal } from '@/shared/ui';
import type { Lead } from '../../types';

const CLOSED_STATUSES = ['Qualified', 'Disqualified', 'Converted'];
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-[8.125rem] shrink-0 font-medium text-ink-muted">{label}</span>
      <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-ink">{children}</span>
    </div>
  );
}

interface ContactLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  isPending: boolean;
  onMarkContacted: () => Promise<unknown>;
}

export function ContactLeadModal({ open, onOpenChange, lead, isPending, onMarkContacted }: ContactLeadModalProps) {
  const status = lead.status ?? 'New';
  const alreadyContacted = status === 'Contacted';
  const isClosed = CLOSED_STATUSES.includes(status);

  const confirm = async () => {
    await onMarkContacted();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Contact Information"
      size="sm"
      dismissible={!isPending}
      footer={
        <Button
          className="w-full"
          disabled={isPending || alreadyContacted || isClosed}
          title={isClosed ? 'Lead already closed' : undefined}
          onClick={confirm}
        >
          {alreadyContacted ? 'Already Contacted' : isPending ? 'Marking as Contacted...' : 'Mark as Contacted'}
        </Button>
      }
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand">
          <Contact2 size={24} />
        </span>
        <h3 className="text-xl font-bold text-ink">{lead.name}</h3>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-5">
        <Row label="Client Name:">{lead.company || 'N/A'}</Row>
        <Row label="Contact Person:">{lead.name}</Row>
        {lead.representative_position && <Row label="Position:">{lead.representative_position}</Row>}
        <Row label="Email:">
          <Mail size={16} className="shrink-0 text-ink-muted" />
          <a href={`mailto:${lead.email}`} className="truncate text-brand hover:underline">
            {lead.email}
          </a>
        </Row>
        <Row label="Phone:">
          <Phone size={16} className="shrink-0 text-ink-muted" />
          <a href={`tel:${lead.phone}`} className="text-brand hover:underline">
            {lead.phone}
          </a>
        </Row>
      </div>
    </Modal>
  );
}

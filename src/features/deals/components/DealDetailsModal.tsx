import { Badge, Button, DetailList, Modal } from '@/shared/ui';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { stageTone } from '../constants';
import { DealAttachments } from './DealAttachments';
import type { Deal } from '../types';

interface DealDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  accountName: string;
  onAccountClick: (accountId: string) => void;
}

export function DealDetailsModal({ open, onOpenChange, deal, accountName, onAccountClick }: DealDetailsModalProps) {
  if (!deal) return null;

  const hasAccount = Boolean(deal.account_id) && accountName !== 'No account linked';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Deal Details"
      footer={<Button onClick={() => onOpenChange(false)}>Close</Button>}
    >
      <DetailList
        columns={2}
        items={[
          { label: 'Deal Name', value: deal.name },
          { label: 'Value', value: formatCurrency(deal.value) },
          {
            label: 'Linked Account',
            value: hasAccount ? (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onAccountClick(String(deal.account_id));
                }}
                className="text-brand hover:underline"
              >
                {accountName}
              </button>
            ) : (
              <span className="font-medium text-ink-muted">{accountName || 'No account linked'}</span>
            ),
          },
          { label: 'Expected Close Date', value: formatDate(deal.close_date) },
          { label: 'Stage', value: <Badge tone={stageTone(deal.stage)}>{deal.stage}</Badge> },
        ]}
      />

      <div className="flex flex-col gap-1.5 border-t border-field pt-4">
        <h4 className="text-2xs font-bold uppercase tracking-wide text-ink-muted">Notes</h4>
        <p
          className={`min-h-[3.125rem] whitespace-pre-wrap rounded-[0.625rem] border-[1.5px] border-line bg-surface-muted px-3.5 py-2.5 text-sm ${
            deal.notes ? 'text-slate-700' : 'text-ink-subtle'
          }`}
        >
          {deal.notes || 'No notes added for this deal.'}
        </p>
      </div>

      <DealAttachments dealId={deal.id} />
    </Modal>
  );
}

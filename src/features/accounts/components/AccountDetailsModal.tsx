import { Briefcase, Info, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Loader, Modal } from '@/shared/ui';
import { capitalize, toAbsoluteUrl } from '@/shared/lib/text';
import { formatCurrency } from '@/shared/lib/format';
import { contactApi } from '@/features/contacts/api/contactApi';
import { dealApi } from '@/features/deals/api/dealApi';
import type { Account } from '../types';

const PREVIEW_LIMIT = 10;

/** Contacts and open deals that point at this account. */
function useLinkedRecords(account: Account | null, enabled: boolean) {
  return useQuery({
    queryKey: ['accounts', 'linked', String(account?.id ?? '')],
    enabled: enabled && Boolean(account?.id),
    queryFn: async () => {
      const id = String(account!.id);
      const [contacts, deals] = await Promise.all([
        contactApi.list({ page: 1, perPage: PREVIEW_LIMIT }),
        dealApi.list({ page: 1, perPage: PREVIEW_LIMIT }),
      ]);
      return {
        contacts: contacts.items.filter((contact) => String(contact.account_id) === id),
        deals: deals.items.filter(
          (deal) => String(deal.account_id) === id && (deal.stage ?? '').toLowerCase().trim() === 'new',
        ),
      };
    },
  });
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface-muted p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
        <span className="text-brand">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

interface AccountDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

export function AccountDetailsModal({ open, onOpenChange, account }: AccountDetailsModalProps) {
  const { data, isPending } = useLinkedRecords(account, open);
  if (!account) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="View Details" size="lg">
      <Section icon={<Info size={18} />} title="About company">
        <dl className="grid gap-2 text-sm text-ink-muted sm:grid-cols-3">
          <div>
            <dt className="font-bold text-ink">Company Name</dt>
            <dd>{capitalize(account.name)}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">Industry</dt>
            <dd>{capitalize(account.industry)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-bold text-ink">Website</dt>
            <dd className="truncate">
              {account.website ? (
                <a href={toAbsoluteUrl(account.website)} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {account.website}
                </a>
              ) : (
                '-'
              )}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {account.description || 'No description available.'}
        </p>
      </Section>

      {isPending ? (
        <Loader className="h-[6.25rem]" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Section icon={<Users size={18} />} title={`Linked contacts (${data?.contacts.length ?? 0})`}>
            <ul className="flex flex-col gap-2">
              {data?.contacts.length ? (
                data.contacts.map((contact) => (
                  <li key={contact.id} className="rounded-xl bg-surface px-3 py-2">
                    <p className="text-sm font-bold text-ink">{contact.name}</p>
                    <p className="text-xs text-ink-muted">
                      {contact.job_title} • {contact.email}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-label text-ink-subtle">No linked contacts found.</li>
              )}
            </ul>
          </Section>

          <Section icon={<Briefcase size={18} />} title={`Open deals (${data?.deals.length ?? 0})`}>
            <ul className="flex flex-col gap-2">
              {data?.deals.length ? (
                data.deals.map((deal) => (
                  <li key={deal.id} className="rounded-xl bg-surface px-3 py-2">
                    <p className="text-sm font-bold text-ink">{deal.name}</p>
                    <p className="text-xs text-ink-muted">
                      {formatCurrency(deal.value)} • {deal.stage}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-label text-ink-subtle">No open deals found.</li>
              )}
            </ul>
          </Section>
        </div>
      )}
    </Modal>
  );
}

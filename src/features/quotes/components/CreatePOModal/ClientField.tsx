import { Building2, Lock } from 'lucide-react';

interface ClientFieldProps {
  name: string;
  company?: string;
}

export function ClientField({ name, company }: ClientFieldProps) {
  return (
    <div className="flex flex-col">
      <span className="mb-1.5 block text-label font-semibold text-slate-600">Client</span>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted px-3.5 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-purple-100 text-brand">
          <Building2 size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">{company || name}</span>
          {company && name && company !== name && (
            <span className="block truncate text-xs text-ink-muted">{name}</span>
          )}
        </span>
        <Lock size={14} aria-hidden className="shrink-0 text-ink-subtle" />
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">Carried over from the converted lead.</p>
    </div>
  );
}

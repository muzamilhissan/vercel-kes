import type { LucideIcon } from 'lucide-react';

interface DetailCardProps {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
  /** Wraps the body in the inset highlighted panel used by the contact card. */
  highlighted?: boolean;
  children: React.ReactNode;
}

/** The white rounded card used throughout the lead details page. */
export function DetailCard({ icon: Icon, title, action, highlighted = false, children }: DetailCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-field bg-surface shadow-[0_4px_20px_rgb(0_0_0_/_0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0_0_0_/_0.06)]">
      <header className="flex items-center gap-3 border-b border-surface-muted bg-surface px-4 py-3">
        <span className="rounded-lg bg-purple-100 p-1.5 text-violet-500">
          <Icon size={16} />
        </span>
        <h3 className="flex-1 text-[0.9375rem] font-bold -tracking-[0.01em] text-ink">{title}</h3>
        {action}
      </header>
      <div
        className={
          highlighted
            ? 'm-4 rounded-xl border border-field bg-linear-to-b from-surface-muted to-surface p-5'
            : 'px-4 py-3'
        }
      >
        {children}
      </div>
    </section>
  );
}

/** Label/value pair inside a DetailCard body. */
export function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    /* Stacked on phones so the value is not squeezed by the fixed label column. */
    <div className="mb-2 flex flex-col text-label last:mb-0 sm:flex-row sm:items-start">
      <span className="font-medium text-ink-muted sm:w-[9.375rem] sm:shrink-0">{label}</span>
      <span className="min-w-0 break-words font-medium text-slate-900 sm:flex-1">{children}</span>
    </div>
  );
}

export function InfoLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="font-semibold text-indigo-500 transition-colors hover:text-indigo-600 hover:underline"
    >
      {children}
    </a>
  );
}

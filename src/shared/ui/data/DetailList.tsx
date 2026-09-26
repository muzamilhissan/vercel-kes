export interface DetailItem {
  label: string;
  value: React.ReactNode;
  /** Let long values such as emails wrap mid-word. */
  breakAll?: boolean;
}

/** Uppercase label above its value — the read-only layout used by the detail modals. */
export function DetailList({ items, columns = 1 }: { items: DetailItem[]; columns?: 1 | 2 }) {
  return (
    <dl className={columns === 2 ? 'grid gap-5 sm:grid-cols-2' : 'flex flex-col gap-5'}>
      {items.map(({ label, value, breakAll }) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="text-2xs font-bold uppercase tracking-wide text-ink-muted">{label}</dt>
          <dd className={`text-[0.9375rem] font-semibold text-ink ${breakAll ? 'break-all' : 'break-words'}`}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

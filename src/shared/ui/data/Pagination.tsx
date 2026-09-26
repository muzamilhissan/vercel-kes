import { cn } from '@/shared/lib/cn';

const EDGE_PAGES = 1;
const SIBLINGS = 1;

/** Page numbers around the current page, with `null` marking a gap. */
function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current]);
  for (let offset = 1; offset <= SIBLINGS; offset += 1) {
    pages.add(Math.max(1, current - offset));
    pages.add(Math.min(total, current + offset));
  }
  for (let page = 1; page <= EDGE_PAGES; page += 1) {
    pages.add(page);
    pages.add(total - page + 1);
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? [null, page] : [page]));
}

const BUTTON =
  'flex h-8 min-w-8 items-center justify-center rounded-lg border border-field bg-surface px-2 text-label font-semibold text-ink-muted transition-all hover:enabled:-translate-y-px hover:enabled:border-brand hover:enabled:bg-brand-50 hover:enabled:text-brand disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-slate-300';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalItems, perPage, onPageChange }: PaginationProps) {
  // Nothing to summarise for an empty table; the table shows its own empty state.
  if (totalItems === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-indigo-50 bg-surface px-7 py-4 shadow-[0_10px_30px_-10px_rgb(112_48_159_/_0.05)]"
    >
      <p className="text-label text-ink-muted">
        Showing <span className="font-semibold text-ink">{from}</span>–
        <span className="font-semibold text-ink">{to}</span> of{' '}
        <span className="font-semibold text-ink">{totalItems}</span>
      </p>

      {/* A single page still reports the count, just without the page controls. */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button type="button" className={BUTTON} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Prev
          </button>

          {buildPageList(page, totalPages).map((entry, index) =>
            entry === null ? (
              <span key={`gap-${index}`} className="px-1 text-label text-ink-subtle">
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                aria-current={entry === page ? 'page' : undefined}
                onClick={() => onPageChange(entry)}
                className={cn(
                  BUTTON,
                  entry === page && 'border-brand bg-brand text-white shadow-[0_4px_12px_rgb(112_48_159_/_0.2)]',
                )}
              >
                {entry}
              </button>
            ),
          )}

          <button type="button" className={BUTTON} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </nav>
  );
}

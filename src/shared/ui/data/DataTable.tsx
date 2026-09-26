import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { SortState } from '@/shared/hooks/useSortable';
import { Loader } from '../feedback/Loader';

export interface Column<T> {
  /** Stable identifier, also used as the React key. */
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Extra classes for this column's cells, e.g. alignment or width. */
  className?: string;
  headerClassName?: string;
  /** Marks the column clickable for sorting; the id is passed back to `onSort`. */
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  /** Minimum table width (rem, so it scales with the root) before it scrolls horizontally. */
  minWidth?: string;
  /**
   * Caps the scroll region so rows scroll under a pinned header instead of the
   * whole page scrolling the header out of view.
   */
  maxHeight?: string;
  sort?: SortState<string>;
  onSort?: (columnId: string) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyMessage = 'Nothing to show yet.',
  onRowClick,
  minWidth = '50rem',
  maxHeight = '70vh',
  sort,
  onSort,
}: DataTableProps<T>) {
  return (
    <div
      style={{ maxHeight }}
      className="scrollbar-thin mt-6 overflow-auto rounded-3xl border border-indigo-50 bg-surface shadow-[0_10px_30px_-10px_rgb(112_48_159_/_0.05)]"
    >
      <table className="w-full border-separate border-spacing-0" style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  'sticky top-0 z-10 bg-linear-to-b from-brand to-brand-600 px-7 py-5 text-left text-2xs font-extrabold uppercase tracking-[0.12em] text-white',
                  index === 0 && 'rounded-tl-3xl',
                  index === columns.length - 1 && 'rounded-tr-3xl',
                  column.headerClassName,
                )}
              >
                {column.sortable && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(column.id)}
                    aria-label={`Sort by ${column.header}`}
                    className="flex select-none items-center gap-2 text-inherit"
                  >
                    <span>{column.header}</span>
                    <SortIcon active={sort?.key === column.id} direction={sort?.direction} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10">
                <Loader className="h-[12.5rem]" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center text-sm text-ink-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'transition-colors even:bg-[#fcfdff] hover:bg-violet-50 [&:last-child>td]:border-b-0',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'border-b border-field px-6 py-[1.125rem] text-sm font-medium text-ink',
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, direction }: { active?: boolean; direction?: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={14} className="opacity-60" />;
  return direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
}

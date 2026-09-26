import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K | null;
  direction: SortDirection;
}

/**
 * Client-side sorting over the rows currently on screen. Clicking a column cycles
 * ascending -> descending -> unsorted, matching the behaviour the tables had before.
 */
export function useSortable<T, K extends string>(rows: T[], accessors: Record<K, (row: T) => string>) {
  const [sort, setSort] = useState<SortState<K>>({ key: null, direction: 'asc' });

  const toggle = (key: K) =>
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      return prev.direction === 'asc' ? { key, direction: 'desc' } : { key: null, direction: 'asc' };
    });

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const read = accessors[sort.key];
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => read(a).localeCompare(read(b)) * factor);
    // `accessors` is an inline literal at every call site, so comparing it would defeat the memo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);

  return { sorted, sort, toggle };
}

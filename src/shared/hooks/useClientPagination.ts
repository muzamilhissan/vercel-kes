import { useEffect, useMemo, useState } from 'react';

export const DEFAULT_CLIENT_PAGE_SIZE = 10;

/**
 * Pages a list in memory. Some endpoints (follow-ups, proposals, the document
 * library) return every record at once, so there is no server page to request.
 */
export function useClientPagination<T>(items: T[], perPage = DEFAULT_CLIENT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  // Deleting the last row on the final page would otherwise strand the user there.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  return { page, setPage, totalPages, totalItems: items.length, perPage, pageItems };
}

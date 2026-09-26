import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Current page held in the URL so paging survives a refresh and the back button. */
export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const setPage = useCallback(
    (next: number) => {
      setSearchParams((params) => {
        if (next > 1) params.set('page', String(next));
        else params.delete('page');
        return params;
      });
    },
    [setSearchParams],
  );

  return { page, setPage };
}

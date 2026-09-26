import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const PARAM = 'q';

/**
 * The header's search box, backed by the URL so a filtered view can be
 * bookmarked and shared. Replaces the old localStorage + window-event bus.
 */
export function useGlobalSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(PARAM) ?? '';

  const setQuery = useCallback(
    (next: string) => {
      setSearchParams(
        (params) => {
          if (next) params.set(PARAM, next);
          else params.delete(PARAM);
          // A new search always starts from the first page.
          params.delete('page');
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { query, setQuery };
}

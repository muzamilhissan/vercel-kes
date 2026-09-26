import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { LeadViewMode } from '../components/list/LeadsPageHeader';

const DEFAULT_MODE: LeadViewMode = 'kanban';

/** Board/list preference held in the URL so a shared link opens the same view. */
export function useLeadViewMode() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode: LeadViewMode = searchParams.get('view') === 'list' ? 'list' : DEFAULT_MODE;

  const setViewMode = useCallback(
    (mode: LeadViewMode) => {
      setSearchParams(
        (params) => {
          if (mode === DEFAULT_MODE) params.delete('view');
          else params.set('view', mode);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { viewMode, setViewMode };
}

import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ADMIN_TABS, type AdminTab } from '../components/AdminConfigTabs';

const DEFAULT_TAB: AdminTab = 'document-types';

export function useAdminTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const tab = ADMIN_TABS.includes(raw as AdminTab) ? (raw as AdminTab) : DEFAULT_TAB;

  const setTab = useCallback(
    (next: AdminTab) => {
      setSearchParams(
        (params) => {
          if (next === DEFAULT_TAB) params.delete('tab');
          else params.set('tab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { tab, setTab };
}

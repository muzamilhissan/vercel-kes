import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LEAD_TABS, type LeadTab } from '../components/detail/LeadDetailsTabs';

const DEFAULT_TAB: LeadTab = 'overview';

/** Active details tab, held in the URL so a tab can be linked to directly. */
export function useLeadTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const tab = LEAD_TABS.includes(raw as LeadTab) ? (raw as LeadTab) : DEFAULT_TAB;

  const setTab = useCallback(
    (next: LeadTab) => {
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

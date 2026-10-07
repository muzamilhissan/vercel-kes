import { useQuery } from '@tanstack/react-query';
import { unwrapList } from '@/shared/api/unwrap';
import { siteApi } from '../api/siteApi';
import type { Site } from '../types';

export function useSites(clientId?: number | string | null, enabled = true) {
  const query = useQuery({
    queryKey: ['sites', String(clientId ?? '')],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => unwrapList<Site>(await siteApi.list(clientId), 'sites'),
  });

  return { query, sites: query.data ?? [], isLoading: query.isFetching };
}

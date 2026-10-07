import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { Site } from '../types';

export const siteApi = {
  list: (clientId?: number | string | null) =>
    api.get<ApiResponse<Site[]>>('/sites/list', {
      params: { client_id: clientId ?? undefined },
    }),
};

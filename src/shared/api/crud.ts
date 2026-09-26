import { api } from './client';
import { unwrapItem, unwrapList } from './unwrap';
import type { ApiResponse } from '@/shared/types/api';

export interface ListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

/** A list response after the API's several envelope shapes have been flattened. */
export interface ListResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface RawListResponse {
  meta?: { current_page?: number; last_page?: number; total?: number };
  [key: string]: unknown;
}

function normalizeList<T>(response: RawListResponse, resource: string, page: number): ListResult<T> {
  const items = unwrapList<T>(response, resource);
  const meta = response.meta;

  return {
    items,
    currentPage: meta?.current_page ?? page,
    totalPages: meta?.last_page ?? 1,
    totalItems: meta?.total ?? items.length,
  };
}

export interface CrudApi<T, TCreate, TUpdate> {
  list(params?: ListParams): Promise<ListResult<T>>;
  show(id: string | number): Promise<ApiResponse<T>>;
  create(input: TCreate): Promise<ApiResponse<T>>;
  update(id: string | number, input: TUpdate): Promise<ApiResponse<T>>;
  remove(id: string | number): Promise<ApiResponse<void>>;
}

export const DEFAULT_PER_PAGE = 10;

/** `leads` -> `lead`; detail endpoints key the record by the singular name. */
const singularize = (resource: string) => (resource.endsWith('s') ? resource.slice(0, -1) : resource);

/**
 * The API exposes the same `list / show / store / update / delete` shape for every
 * top-level resource, so each feature builds its client from this factory instead
 * of restating the five calls.
 */
export function createCrudApi<T, TCreate, TUpdate = Partial<TCreate>>(
  resource: string,
): CrudApi<T, TCreate, TUpdate> {
  return {
    async list({ page = 1, perPage = DEFAULT_PER_PAGE, search } = {}) {
      const response = await api.get<RawListResponse>(`/${resource}/list`, {
        params: { page, per_page: perPage, search: search?.trim() || undefined },
      });
      return normalizeList<T>(response, resource, page);
    },
    async show(id) {
      const response = await api.get<ApiResponse<T>>(`/${resource}/show/${id}`);
      const data = unwrapItem<T>(response, singularize(resource));
      if (!data) throw new Error(`${singularize(resource)} not found.`);
      return { ...response, data };
    },
    async create(input) {
      const response = await api.post<ApiResponse<T>>(`/${resource}/store`, input);
      // Callers read the new record's id, which may sit under `data` or the singular key.
      return { ...response, data: unwrapItem<T>(response, singularize(resource)) as T };
    },
    async update(id, input) {
      const response = await api.put<ApiResponse<T>>(`/${resource}/update/${id}`, input);
      return { ...response, data: unwrapItem<T>(response, singularize(resource)) as T };
    },
    remove: (id) => api.delete<ApiResponse<void>>(`/${resource}/delete/${id}`),
  };
}

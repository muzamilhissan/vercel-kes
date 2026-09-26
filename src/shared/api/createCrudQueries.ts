import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import type { CrudApi, ListParams } from './crud';
import type { ApiResponse } from '@/shared/types/api';

export interface CrudLabels {
  /** Singular, capitalised — e.g. "Lead". Used to build toast messages. */
  singular: string;
}

/**
 * Query + mutation hooks for a resource built with `createCrudApi`. Mutations
 * invalidate the resource's list on success, so views refresh without the
 * manual event-bus refetching the app used to rely on.
 */
export function createCrudQueries<T, TCreate, TUpdate>(
  resource: string,
  client: CrudApi<T, TCreate, TUpdate>,
  { singular }: CrudLabels,
) {
  const keys = {
    all: [resource] as const,
    lists: () => [resource, 'list'] as const,
    list: (params: ListParams) => [resource, 'list', params] as const,
    details: () => [resource, 'detail'] as const,
    detail: (id: string | number) => [resource, 'detail', String(id)] as const,
  };

  function useList(params: ListParams = {}) {
    return useQuery({
      queryKey: keys.list(params),
      queryFn: () => client.list(params),
      placeholderData: keepPreviousData,
    });
  }

  function useItem(id: string | number | undefined) {
    return useQuery({
      queryKey: keys.detail(id ?? ''),
      queryFn: () => client.show(id!),
      enabled: id !== undefined && id !== '',
    });
  }

  /** Shared success/error handling so each mutation below stays a one-liner. */
  function useResourceMutation<TVars, TData>(
    mutationFn: (vars: TVars) => Promise<TData>,
    successMessage: string,
    options?: UseMutationOptions<TData, Error, TVars>,
  ) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn,
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: keys.all });
        toast.success(successMessage);
        options?.onSuccess?.(...args);
      },
      onError: (error, ...rest) => {
        toast.error(error.message || `Could not save ${singular.toLowerCase()}.`);
        options?.onError?.(error, ...rest);
      },
    });
  }

  const useCreate = (options?: UseMutationOptions<ApiResponse<T>, Error, TCreate>) =>
    useResourceMutation((input: TCreate) => client.create(input), `${singular} created successfully.`, options);

  const useUpdate = (
    options?: UseMutationOptions<ApiResponse<T>, Error, { id: string | number; input: TUpdate }>,
  ) =>
    useResourceMutation(
      ({ id, input }: { id: string | number; input: TUpdate }) => client.update(id, input),
      `${singular} updated successfully.`,
      options,
    );

  const useRemove = (options?: UseMutationOptions<ApiResponse<void>, Error, string | number>) =>
    useResourceMutation((id: string | number) => client.remove(id), `${singular} deleted successfully.`, options);

  return { keys, useList, useItem, useCreate, useUpdate, useRemove, useResourceMutation };
}

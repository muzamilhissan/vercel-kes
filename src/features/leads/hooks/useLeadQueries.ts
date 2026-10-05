import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCrudQueries } from '@/shared/api/createCrudQueries';
import { unwrapList } from '@/shared/api/unwrap';
import { toast } from '@/shared/toast';
import type { User } from '@/shared/types/api';
import { leadApi } from '../api/leadApi';
import type { ConvertLeadInput, CreateLeadInput, Lead, UpdateLeadInput } from '../types';

const ALL_LEADS_PER_PAGE = 1000;

export const leadQueries = createCrudQueries<Lead, CreateLeadInput, UpdateLeadInput>('leads', leadApi, {
  singular: 'Lead',
});

export const {
  keys: leadKeys,
  useList: useLeadList,
  useCreate: useCreateLead,
  useUpdate: useUpdateLead,
  useRemove: useDeleteLead,
  useResourceMutation,
} = leadQueries;

/**
 * Every lead, unpaginated. The kanban board and the stats cards summarise the whole
 * pipeline rather than the page the table happens to be showing.
 */
export function useAllLeads(search?: string) {
  return useLeadList({ page: 1, perPage: ALL_LEADS_PER_PAGE, search });
}

export function useConvertedLeads({ page = 1, perPage }: { page?: number; perPage?: number } = {}) {
  return useQuery({
    queryKey: ['leads', 'converted', page, perPage],
    queryFn: () => leadApi.convertedList({ page, perPage }),
    placeholderData: keepPreviousData,
  });
}

export function useAssignableUsers() {
  return useQuery({
    queryKey: ['leads', 'assignable-users'],
    queryFn: async () => unwrapList<User>(await leadApi.getAssignableUsers(), 'users'),
    staleTime: 5 * 60_000,
  });
}

export function useAssignLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userIds }: { id: string | number; userIds: (string | number)[] }) =>
      leadApi.assign(id, userIds),
    onSuccess: () => {
      toast.success('Lead assigned successfully');
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: (error: Error) => toast.error(error.message || 'Error assigning lead'),
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: ConvertLeadInput }) => leadApi.convert(id, input),
    onSuccess: () => {
      toast.success('Lead converted successfully');
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Error converting lead'),
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) => leadApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.all }),
    onError: (error: Error) => toast.error(error.message || 'Could not update lead status'),
  });
}

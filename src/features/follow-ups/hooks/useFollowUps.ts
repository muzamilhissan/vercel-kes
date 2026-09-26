import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { unwrapList } from '@/shared/api/unwrap';
import { followUpApi } from '../api/followUpApi';
import type { CreateFollowUpInput, LeadFollowUp } from '../types';

const followUpsKey = (leadId: string | number) => ['leads', String(leadId), 'follow-ups'] as const;

export function useFollowUps(leadId: string | number) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: followUpsKey(leadId) });

  const onError = (error: Error) => toast.error(error.message || 'Action failed');

  const query = useQuery({
    queryKey: followUpsKey(leadId),
    queryFn: async () => unwrapList<LeadFollowUp>(await followUpApi.list(leadId), 'follow_ups', 'followUps'),
  });

  const save = useMutation({
    mutationFn: ({ id, input }: { id?: string | number; input: CreateFollowUpInput }) =>
      id ? followUpApi.update(leadId, id, input) : followUpApi.create(leadId, input),
    onSuccess: (_data, { id }) => {
      toast.success(`Follow-up ${id ? 'updated' : 'scheduled'} successfully`);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error saving follow-up'),
  });

  const cancel = useMutation({
    mutationFn: (followUp: LeadFollowUp) => followUpApi.cancel(leadId, followUp.id),
    onSuccess: () => {
      toast.success('Follow-up cancelled successfully');
      invalidate();
    },
    onError,
  });

  const remove = useMutation({
    mutationFn: (followUp: LeadFollowUp) => followUpApi.remove(leadId, followUp.id),
    onSuccess: () => {
      toast.success('Follow-up deleted successfully');
      invalidate();
    },
    onError,
  });

  return { query, save, cancel, remove };
}

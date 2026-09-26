import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { unwrapList } from '@/shared/api/unwrap';
import { proposalApi, proposalRequestApi } from '../api/proposalApi';
import type { CreateProposalRequestInput, Proposal } from '../types';

const proposalsKey = (leadId: string | number) => ['leads', String(leadId), 'proposals'] as const;

/** Questionnaire options are global and rarely change, so they are cached for the session. */
export function useProposalOptions() {
  return useQuery({
    queryKey: ['proposal-options'],
    queryFn: async () => {
      const response = await proposalRequestApi.options();
      if (!response.success || !response.options) {
        throw new Error(response.message || 'Failed to load proposal options');
      }
      return response.options;
    },
    staleTime: Infinity,
  });
}

export function useProposals(leadId: string | number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: proposalsKey(leadId),
    queryFn: async () => unwrapList<Proposal>(await proposalApi.list(leadId), 'proposals'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: proposalsKey(leadId) });

  const send = useMutation({
    mutationFn: (body: FormData) => proposalApi.create(leadId, body),
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message || 'An error occurred while sending the proposal.'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: FormData }) => proposalApi.update(leadId, id, body),
    onSuccess: () => {
      toast.success('Proposal updated successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update proposal'),
  });

  const remove = useMutation({
    mutationFn: (id: string | number) => proposalApi.remove(leadId, id),
    onSuccess: () => {
      toast.success('Proposal deleted successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete proposal'),
  });

  return { query, send, update, remove };
}

/** Asks the backend to draft a proposal from the questionnaire answers. */
export function useGenerateProposal(leadId: string | number) {
  return useMutation({
    mutationFn: async (input: CreateProposalRequestInput) => {
      const response = await proposalRequestApi.create(leadId, input);
      const generated = response.proposal_request?.generated_content;
      if (!response.success || !generated) {
        throw new Error(response.message || 'Failed to generate proposal content');
      }
      return generated;
    },
    onSuccess: () => toast.success('Proposal generated successfully!'),
    onError: (error: Error) => toast.error(error.message || 'An error occurred while generating proposal content'),
  });
}

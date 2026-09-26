import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { leadApi } from '../api/leadApi';
import type { LeadFormOutput } from '../components/dialogs/LeadFormModal/schema';
import { assigneesOf } from '../lib/assignees';
import type { CreateLeadInput, Lead } from '../types';
import { leadKeys, useCreateLead, useUpdateLead } from './useLeadQueries';

/** Strip the assignee list, which the API takes on its own endpoint. */
function toLeadPayload({ assigned_to: _assigned, ...values }: LeadFormOutput): CreateLeadInput {
  return { ...values, representative_position: values.representative_position || undefined };
}

const sameMembers = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

/**
 * Saving a lead is up to two calls: the lead itself, then its assignees. The assign
 * endpoint rejects an empty list, so it is only called when the selection actually
 * changed. A failure to assign is reported but does not undo the save.
 */
export function useSaveLead(isSuperAdmin: boolean) {
  const queryClient = useQueryClient();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const save = async (values: LeadFormOutput, existing: Lead | null) => {
    const payload = toLeadPayload(values);
    const verb = existing ? 'updated' : 'created';

    const response = existing
      ? await updateLead.mutateAsync({ id: existing.id, input: payload })
      : await createLead.mutateAsync(payload);

    if (!isSuperAdmin) return;

    const current = existing ? assigneesOf(existing).map((assignee) => assignee.id) : [];
    if (sameMembers(current, values.assigned_to)) return;

    const leadId = existing?.id ?? response.data?.id;
    if (!leadId) {
      toast.warning(`Lead ${verb}, but could not determine ID for assignment`);
      return;
    }

    try {
      await leadApi.assign(leadId, values.assigned_to);
    } catch {
      toast.warning(`Lead ${verb}, but failed to assign users`);
    } finally {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    }
  };

  return { save, isPending: createLead.isPending || updateLead.isPending };
}

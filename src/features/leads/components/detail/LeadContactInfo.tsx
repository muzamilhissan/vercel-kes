import { Contact2 } from 'lucide-react';
import { toAbsoluteUrl } from '@/shared/lib/text';
import { DetailCard, InfoLink, InfoRow } from './DetailCard';
import type { Lead } from '../../types';

const COMPANY_NAME = 'Kudon Engineering Services';

export function LeadContactInfo({ lead }: { lead: Lead }) {
  return (
    <DetailCard icon={Contact2} title="Contact Information" highlighted>
      <InfoRow label="Client Name:">{COMPANY_NAME}</InfoRow>
      <InfoRow label="Contact Person:">{lead.name}</InfoRow>
      {lead.representative_position && <InfoRow label="Position:">{lead.representative_position}</InfoRow>}
      <InfoRow label="Email:">
        <InfoLink href={`mailto:${lead.email}`}>{lead.email}</InfoLink>
      </InfoRow>
      <InfoRow label="Phone:">
        <InfoLink href={`tel:${lead.phone}`}>{lead.phone}</InfoLink>
      </InfoRow>
      <InfoRow label="Website:">
        {lead.website ? <InfoLink href={toAbsoluteUrl(lead.website)}>{lead.website}</InfoLink> : 'N/A'}
      </InfoRow>
      <InfoRow label="Source:">{lead.source || 'N/A'}</InfoRow>
    </DetailCard>
  );
}

import { Building2 } from 'lucide-react';
import { DetailCard, InfoLink, InfoRow } from './DetailCard';
import type { Lead } from '../../types';

export function LeadBillingDetails({ lead }: { lead: Lead }) {
  return (
    <DetailCard icon={Building2} title="Billing & Registration" highlighted>
      <InfoRow label="VAT Number:">{lead.vat_number || 'N/A'}</InfoRow>
      <InfoRow label="Vendor Number:">{lead.vendor_number || 'N/A'}</InfoRow>
      <InfoRow label="Registration No.:">{lead.registration_no || 'N/A'}</InfoRow>
      <InfoRow label="Enduser Name:">{lead.enduser_name || 'N/A'}</InfoRow>
      <InfoRow label="Finance Email:">
        {lead.finance_email ? <InfoLink href={`mailto:${lead.finance_email}`}>{lead.finance_email}</InfoLink> : 'N/A'}
      </InfoRow>
      <InfoRow label="Billing Statement Email:">
        {lead.billing_statement_email ? (
          <InfoLink href={`mailto:${lead.billing_statement_email}`}>{lead.billing_statement_email}</InfoLink>
        ) : (
          'N/A'
        )}
      </InfoRow>
      <InfoRow label="Address:">
        <span className="whitespace-pre-wrap">{lead.address || 'N/A'}</span>
      </InfoRow>
    </DetailCard>
  );
}

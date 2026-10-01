import { PageHeader } from '@/shared/ui';
import { DocumentTypesPanel } from '@/features/document-types/components/DocumentTypesPanel';
import { AdminConfigTabs } from '../components/AdminConfigTabs';
import { useAdminTab } from '../hooks/useAdminTab';

export default function AdminConfigurationsPage() {
  const { tab, setTab } = useAdminTab();

  return (
    <>
      <PageHeader
        title="Admin Configurations"
        subtitle="Manage the lookup values the rest of the CRM selects from."
      />

      <AdminConfigTabs active={tab} onChange={setTab} />

      {tab === 'document-types' && <DocumentTypesPanel />}
    </>
  );
}

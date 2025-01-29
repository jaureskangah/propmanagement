import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunicationsContent } from "@/components/tenant/communications/TenantCommunicationsContent";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";

const TenantCommunications = () => {
  const {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications
  } = useTenantCommunications();

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        {!tenantId ? (
          <UnlinkedTenantMessage />
        ) : (
          <TenantCommunicationsContent
            communications={communications}
            onCreateCommunication={handleCreateCommunication}
            onCommunicationUpdate={refreshCommunications}
          />
        )}
      </div>
    </div>
  );
};

export default TenantCommunications;
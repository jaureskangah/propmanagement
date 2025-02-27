
import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunications as TenantCommunicationsComponent } from "@/components/tenant/TenantCommunications";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";

const Communications = () => {
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
          <TenantCommunicationsComponent
            communications={communications}
            tenantId={tenantId}
            onCommunicationUpdate={refreshCommunications}
          />
        )}
      </div>
    </div>
  );
};

export default Communications;


import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunications as TenantCommunicationsComponent } from "@/components/tenant/TenantCommunications";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Communications = () => {
  const { toast } = useToast();
  const {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications,
    isLoading,
    tenant
  } = useTenantCommunications();

  useEffect(() => {
    if (!isLoading && communications.length === 0 && tenantId) {
      toast({
        title: "Bienvenue dans vos communications",
        description: "Vous pouvez envoyer des messages à votre propriétaire directement depuis cette page.",
      });
    }
  }, [isLoading, communications, tenantId]);

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : !tenantId ? (
          <UnlinkedTenantMessage />
        ) : (
          <TenantCommunicationsComponent
            communications={communications}
            tenantId={tenantId}
            onCommunicationUpdate={refreshCommunications}
            tenant={tenant}
          />
        )}
      </div>
    </div>
  );
};

export default Communications;

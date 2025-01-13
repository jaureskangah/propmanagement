import React from "react";
import { Card } from "@/components/ui/card";
import { TenantInfoCard } from "./tenant/profile/TenantInfoCard";
import { UnlinkedTenantProfile } from "./tenant/profile/UnlinkedTenantProfile";
import { TenantTabs } from "./tenant/profile/TenantTabs";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "@/hooks/useAuthSession";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();
  const isTenantUser = session?.user?.id === tenant.tenant_profile_id;

  // Préchargement des données
  React.useEffect(() => {
    console.log("Préchargement des données du tenant:", tenant.id);
    // Précharger les documents
    queryClient.prefetchQuery({
      queryKey: ["tenant_documents", tenant.id],
      queryFn: async () => tenant.documents
    });
    // Précharger les paiements
    queryClient.prefetchQuery({
      queryKey: ["tenant_payments", tenant.id],
      queryFn: async () => tenant.paymentHistory
    });
    // Précharger les demandes de maintenance
    queryClient.prefetchQuery({
      queryKey: ["tenant_maintenance", tenant.id],
      queryFn: async () => tenant.maintenanceRequests
    });
  }, [tenant.id, queryClient]);

  if (!tenant) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No tenant selected</p>
      </Card>
    );
  }

  const handleDataUpdate = () => {
    console.log("Invalidating tenant queries");
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
  };

  // Si l'utilisateur est un tenant non lié, montrer uniquement le bouton de liaison
  if (session?.user && !isTenantUser && session.user.email === tenant.email) {
    return <UnlinkedTenantProfile tenant={tenant} onProfileLinked={handleDataUpdate} />;
  }

  return (
    <div className="space-y-6">
      <TenantInfoCard tenant={tenant} />
      <TenantTabs 
        tenant={tenant} 
        isTenantUser={isTenantUser} 
        handleDataUpdate={handleDataUpdate} 
      />
    </div>
  );
};

export default TenantProfile;
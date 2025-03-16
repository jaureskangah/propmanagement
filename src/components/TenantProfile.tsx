
import React from "react";
import { TenantInfoCard } from "./tenant/profile/TenantInfoCard";
import { UnlinkedTenantProfile } from "./tenant/profile/UnlinkedTenantProfile";
import { TenantTabs } from "./tenant/profile/TenantTabs";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const isTenantUser = user?.id === tenant.tenant_profile_id;

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
      <Card className="h-[300px] flex items-center justify-center shadow-md dark:bg-gray-900">
        <CardContent>
          <p className="text-muted-foreground">{t('noTenantSelected')}</p>
        </CardContent>
      </Card>
    );
  }

  const handleDataUpdate = () => {
    console.log("Invalidating tenant queries");
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
  };

  if (user && !isTenantUser && user.email === tenant.email) {
    return <UnlinkedTenantProfile tenant={tenant} onProfileLinked={handleDataUpdate} />;
  }

  return (
    <div className="space-y-6 pb-10 w-full">
      <TenantInfoCard tenant={tenant} />
      <div className="mt-6 w-full">
        <TenantTabs 
          tenant={tenant} 
          isTenantUser={isTenantUser} 
          handleDataUpdate={handleDataUpdate} 
        />
      </div>
    </div>
  );
};

export default TenantProfile;

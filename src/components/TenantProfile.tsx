
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

  // Préchargement des données avec des valeurs par défaut
  React.useEffect(() => {
    console.log("Préchargement des données du tenant:", tenant.id);
    
    // Précharger les documents avec une valeur par défaut
    queryClient.setQueryData(
      ["tenant_documents", tenant.id],
      tenant.documents || []
    );
    
    // Précharger les paiements avec une valeur par défaut
    queryClient.setQueryData(
      ["tenant_payments", tenant.id],
      tenant.paymentHistory || []
    );
    
    // Précharger les demandes de maintenance avec une valeur par défaut
    queryClient.setQueryData(
      ["tenant_maintenance", tenant.id],
      tenant.maintenanceRequests || []
    );
  }, [tenant.id, tenant.documents, tenant.paymentHistory, tenant.maintenanceRequests, queryClient]);

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
    <div className={`space-y-6 ${isMobile ? 'pb-10' : ''}`}>
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

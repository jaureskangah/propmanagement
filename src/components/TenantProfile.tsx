import React, { useState, useEffect } from "react";
import { TenantInfoCard } from "./tenant/profile/TenantInfoCard";
import { UnlinkedTenantProfile } from "./tenant/profile/UnlinkedTenantProfile";
import { TenantTabs } from "./tenant/profile/TenantTabs";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const isTenantUser = user?.id === tenant.tenant_profile_id;
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['overview', 'payments', 'documents', 'maintenance', 'communications'].includes(tabFromUrl)) {
      console.log("Setting active tab from URL:", tabFromUrl);
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  React.useEffect(() => {
    console.log("Préchargement des données du tenant:", tenant.id);
    queryClient.prefetchQuery({
      queryKey: ["tenant_documents", tenant.id],
      queryFn: async () => tenant.documents
    });
    queryClient.prefetchQuery({
      queryKey: ["tenant_payments", tenant.id],
      queryFn: async () => tenant.paymentHistory
    });
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
    <div className={`space-y-6 ${isMobile ? 'pb-10' : ''}`}>
      <TenantInfoCard tenant={tenant} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TenantTabs 
            tenant={tenant} 
            isTenantUser={isTenantUser} 
            handleDataUpdate={handleDataUpdate} 
          />
        </TabsContent>
        <TabsContent value="payments">
          {/* Content for payments */}
        </TabsContent>
        <TabsContent value="documents">
          {/* Content for documents */}
        </TabsContent>
        <TabsContent value="maintenance">
          {/* Content for maintenance */}
        </TabsContent>
        <TabsContent value="communications">
          {/* Content for communications */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantProfile;

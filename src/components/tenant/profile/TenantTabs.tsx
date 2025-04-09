import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { Tenant } from "@/types/tenant";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="documents">{t('documents')}</TabsTrigger>
        <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
        <TabsTrigger value="maintenance">{t('maintenanceRequests.maintenanceRequests')}</TabsTrigger>
        {isTenantUser && <TabsTrigger value="contact">{t('contact')}</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="overview">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">{t('overview')}</h3>
          <div>{t('overviewContent')}</div>
        </div>
      </TabsContent>
      
      <TabsContent value="payments">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">{t('payments')}</h3>
          <div>{t('paymentHistory')}</div>
        </div>
      </TabsContent>
      
      <TabsContent value="maintenance">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">{t('maintenanceRequests.maintenanceRequests')}</h3>
          <div>{t('maintenanceRequests.requestList')}</div>
        </div>
      </TabsContent>
      
      {isTenantUser && (
        <TabsContent value="contact">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium mb-4">{t('contact')}</h3>
            <div>{t('contactInformation')}</div>
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="documents" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-4">{t('documents')}</h3>
          <DocumentGenerator />
        </div>
      </TabsContent>
    </Tabs>
  );
};

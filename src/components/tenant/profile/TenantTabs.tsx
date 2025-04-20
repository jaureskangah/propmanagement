import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { Files, Wrench, FileText } from "lucide-react";
import { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocuments } from "@/components/tenant/TenantDocuments";
import { TenantPayments } from "@/components/tenant/TenantPayments";
import { TenantMaintenance } from "@/components/tenant/TenantMaintenance";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('documents');
  const tabsListRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (tabsListRef.current && isMobile) {
      const activeElement = tabsListRef.current.querySelector('[data-state="active"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab, isMobile]);

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="documents" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b px-3 overflow-auto bg-gray-50 dark:bg-gray-800/50">
          <TabsList 
            ref={tabsListRef}
            className="inline-flex h-12 items-center justify-start rounded-none bg-transparent p-0 w-max overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <TabsTrigger
              className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:bg-[#ea384c]/10 dark:data-[state=active]:bg-[#ea384c]/20 data-[state=active]:text-[#ea384c] dark:data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm whitespace-nowrap"
              value="documents"
            >
              <Files className="mr-2 h-4 w-4" />
              {t('documents')}
            </TabsTrigger>

            <TabsTrigger
              className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:bg-[#ea384c]/10 dark:data-[state=active]:bg-[#ea384c]/20 data-[state=active]:text-[#ea384c] dark:data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm whitespace-nowrap"
              value="payments"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('payments')}
            </TabsTrigger>

            <TabsTrigger
              className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:bg-[#ea384c]/10 dark:data-[state=active]:bg-[#ea384c]/20 data-[state=active]:text-[#ea384c] dark:data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm whitespace-nowrap"
              value="maintenance"
            >
              <Wrench className="mr-2 h-4 w-4" />
              {t('maintenance')}
            </TabsTrigger>
            
            <TabsTrigger
              className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:bg-[#ea384c]/10 dark:data-[state=active]:bg-[#ea384c]/20 data-[state=active]:text-[#ea384c] dark:data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm whitespace-nowrap"
              value="documentGenerator"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('documentGenerator.documentGenerator')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className={cn("p-0", isMobile ? "p-2" : "p-4")}>
            <TenantDocuments 
              documents={tenant.documents} 
              tenantId={tenant.id}
              onDocumentUpdate={handleDataUpdate}
              tenant={tenant}
            />
          </CardContent>
        </TabsContent>

        <TabsContent value="payments" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className={cn("p-0", isMobile ? "p-2" : "p-4")}>
            <TenantPayments 
              payments={tenant.paymentHistory || []} 
              tenantId={tenant.id}
              onPaymentUpdate={handleDataUpdate}
            />
          </CardContent>
        </TabsContent>

        <TabsContent value="maintenance" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className={cn("p-0", isMobile ? "p-2" : "p-4")}>
            <TenantMaintenance 
              requests={tenant.maintenanceRequests ? [...tenant.maintenanceRequests].sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              ) : []}
              tenantId={tenant.id}
              onMaintenanceUpdate={handleDataUpdate}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="documentGenerator" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className={cn("p-4 pt-6", isMobile ? "p-2 pt-4" : "")}>
            <DocumentGenerator tenant={tenant} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

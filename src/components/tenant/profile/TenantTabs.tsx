
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { MessageSquare, Files, Wrench, FileText } from "lucide-react";
import { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocuments } from "@/components/tenant/TenantDocuments";
import { TenantPayments } from "@/components/tenant/TenantPayments";
import { TenantCommunications } from "@/components/tenant/TenantCommunications";
import { TenantMaintenance } from "@/components/tenant/TenantMaintenance";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('documents');
  
  // Handle communication toggle status
  const handleToggleStatus = (comm: any) => {
    console.log("Toggle status for communication:", comm.id);
    // Implementation would depend on your API
    handleDataUpdate();
  };
  
  // Handle communication deletion
  const handleDeleteCommunication = (comm: any) => {
    console.log("Delete communication:", comm.id);
    // Implementation would depend on your API
    handleDataUpdate();
  };

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="documents" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b px-3 overflow-auto">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-none bg-transparent p-0 w-auto">
            <TabsTrigger
              className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="documents"
            >
              <Files className="mr-2 h-4 w-4" />
              {t('documents')}
            </TabsTrigger>

            <TabsTrigger
              className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="payments"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('payments')}
            </TabsTrigger>

            <TabsTrigger
              className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="communications"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('communications')}
            </TabsTrigger>

            <TabsTrigger
              className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="maintenance"
            >
              <Wrench className="mr-2 h-4 w-4" />
              {t('maintenance')}
            </TabsTrigger>
            
            <TabsTrigger
              className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              value="documentGenerator"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('documentGenerator.documentGenerator') || 'Générateur de documents'}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documents" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantDocuments 
              documents={tenant.documents} 
              tenantId={tenant.id}
              onDocumentUpdate={handleDataUpdate}
              tenant={tenant}
            />
          </CardContent>
        </TabsContent>

        <TabsContent value="payments" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantPayments 
              payments={tenant.paymentHistory || []} 
              tenantId={tenant.id}
              onPaymentUpdate={handleDataUpdate}
            />
          </CardContent>
        </TabsContent>

        <TabsContent value="communications" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantCommunications 
              communications={tenant.communications} 
              tenantId={tenant.id}
              onCommunicationUpdate={handleDataUpdate}
              onToggleStatus={handleToggleStatus}
              onDeleteCommunication={handleDeleteCommunication}
              tenant={tenant}
            />
          </CardContent>
        </TabsContent>

        <TabsContent value="maintenance" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantMaintenance 
              requests={tenant.maintenanceRequests || []}
              tenantId={tenant.id}
              onMaintenanceUpdate={handleDataUpdate}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="documentGenerator" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-4 pt-6">
            <DocumentGenerator tenant={tenant} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

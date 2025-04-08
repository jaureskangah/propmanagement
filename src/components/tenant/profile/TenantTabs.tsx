
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { DocumentIcon, MessageSquare, Files, Wrench, FileText } from "lucide-react";
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
              <DocumentIcon className="mr-2 h-4 w-4" />
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
            <TenantDocuments tenant={tenant} />
          </CardContent>
        </TabsContent>

        <TabsContent value="payments" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantPayments tenant={tenant} />
          </CardContent>
        </TabsContent>

        <TabsContent value="communications" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantCommunications tenant={tenant} />
          </CardContent>
        </TabsContent>

        <TabsContent value="maintenance" className="focus-visible:outline-none focus-visible:ring-0">
          <CardContent className="p-0">
            <TenantMaintenance tenant={tenant} />
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


import { TenantDocuments } from "../TenantDocuments";
import { QuickUpload } from "../upload/QuickUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { TenantDocument } from "@/types/tenant";
import type { TenantData } from "@/hooks/tenant/dashboard/useTenantData";

interface TenantDocumentsSectionProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
  tenant: TenantData;
}

export const TenantDocumentsSection = ({
  documents,
  tenantId,
  onDocumentUpdate,
  tenant
}: TenantDocumentsSectionProps) => {
  const { t } = useLocale();
  
  // Convert TenantData to format expected by TenantDocuments
  const tenantForDocuments = {
    ...tenant,
    phone: null,
    user_id: '',
    created_at: '',
    updated_at: '',
    tenant_profile_id: null,
    documents: [],
    paymentHistory: [],
    maintenanceRequests: [],
    communications: [],
    security_deposit: null,
    notes: null
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t('uploadDocuments')}
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('manageDocuments')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('quickUpload')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuickUpload 
                tenantId={tenantId}
                onUploadComplete={onDocumentUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-6">
          <div className="bg-gradient-to-br from-blue-50/50 via-card to-purple-50/50 dark:from-blue-950/20 dark:via-card dark:to-purple-950/20 rounded-2xl p-6 border border-border shadow-sm">
            <TenantDocuments 
              documents={documents}
              tenantId={tenantId}
              onDocumentUpdate={onDocumentUpdate}
              tenant={tenantForDocuments}
            />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

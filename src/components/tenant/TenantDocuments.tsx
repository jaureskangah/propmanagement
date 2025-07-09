
import { FileText, ExternalLink, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./DocumentUpload";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface TenantDocumentsProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
  tenant: Tenant;
}

export const TenantDocuments = ({ 
  documents, 
  tenantId,
  onDocumentUpdate,
  tenant 
}: TenantDocumentsProps) => {
  const { toast } = useToast();
  const { t, language } = useLocale();


  const handleDelete = async (documentId: string, filename: string) => {
    try {
      console.log("Deleting document:", filename);

      const { error: deleteError } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        console.error("Error deleting document:", deleteError);
        throw deleteError;
      }

      toast({
        title: t('success'),
        description: t('documentDeleted'),
      });

      onDocumentUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: t('error'),
        description: t('error'),
        variant: "destructive",
      });
    }
  };

  // Ensure documents is always an array
  const safeDocuments = documents || [];

  return (
    <div className="space-y-6">
      {/* Security disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg"
      >
        <div className="flex items-start gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-500 flex-shrink-0 mt-0.5">
            <span className="sr-only">Avertissement</span>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong className="font-medium">{t('securityReminder')}</strong> {t('securityDisclaimerText')}
          </p>
        </div>
      </motion.div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{t('uploadedDocuments')}</CardTitle>
          </div>
          <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeDocuments.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('noDocuments')}
                </p>
              </div>
            ) : (
              safeDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(doc.created_at, language)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title={t('openDocument')}
                      className="hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                      title={t('confirmDeleteDocument')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

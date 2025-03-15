
import { useState } from "react";
import { FileText, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "../DocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tenant } from "@/types/tenant";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentsHeaderProps {
  tenant: Tenant | null;
  onDocumentUpdate: () => void;
}

export const DocumentsHeader = ({ tenant, onDocumentUpdate }: DocumentsHeaderProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUploadClick = () => {
    if (!tenant) {
      toast({
        title: t("error"),
        description: t("tenantProfileNotFound"),
        variant: "destructive"
      });
      return;
    }
    setIsUploadOpen(prev => !prev);
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:border-gray-700/40 dark:from-gray-900 dark:to-gray-800/30">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center dark:bg-primary/20">
              <FileText 
                className="h-6 w-6 text-primary dark:text-primary/90"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans dark:from-blue-400 dark:to-blue-600">
                {t("myDocuments")}
              </h1>
              <p className="text-muted-foreground text-sm font-sans dark:text-gray-400">
                {t("manageDocumentsDescription", { fallback: 'Upload and manage important documents for your tenancy' })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {isUploadOpen ? (
                    <>
                      <Upload className="h-4 w-4" />
                      {t("uploadDocument")}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {t("uploadNewDocument")}
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isUploadOpen ? t("uploadDocument") : t("uploadNewDocument")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {isUploadOpen && tenant && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900"
        >
          <DocumentUpload tenantId={tenant.id} onUploadComplete={() => {
            onDocumentUpdate();
            // Close the upload form after a successful upload
            setIsUploadOpen(false);
          }} />
        </motion.div>
      )}
    </div>
  );
};

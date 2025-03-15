
import { useState, useEffect } from "react";
import { FileText, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "../DocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tenant } from "@/types/tenant";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("myDocuments") || "Mes documents"}
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isUploadOpen ? (
              <>
                <Upload className="h-4 w-4" />
                {t("uploadDocument") || "Télécharger un document"}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {t("uploadNewDocument") || "Télécharger un nouveau document"}
              </>
            )}
          </Button>
        </motion.div>
      </div>
      
      {isUploadOpen && tenant && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900"
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

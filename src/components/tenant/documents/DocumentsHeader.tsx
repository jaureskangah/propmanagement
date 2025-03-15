
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
          <FileText className="h-6 w-6 mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold">{t("myDocuments")}</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button 
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
        </motion.div>
      </div>
      
      {isUploadOpen && tenant && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900"
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

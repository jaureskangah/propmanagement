
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentGenerator as DocGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DocumentGenerator = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto pt-24 md:pt-0">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h1 className="text-3xl font-bold">{t('documentGenerator.documentGenerator') || "Générateur de documents"}</h1>
              <Button 
                variant="outline"
                onClick={() => navigate('/document-history')}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <History className="h-4 w-4" />
                {t('documentGenerator.documentHistory') || "Historique des documents"}
              </Button>
            </div>

            <div className="pb-16">
              <DocGenerator />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;


import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistory } from "@/components/documents/history/DocumentHistory";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DocumentHistoryPage = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto pt-20 md:pt-0 md:ml-[270px] md:w-[calc(100%-270px)]">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h1 className="text-3xl font-bold">{t('documentHistory') || "Historique des documents"}</h1>
              <Button 
                variant="outline"
                onClick={() => navigate('/documents')}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <FileText className="h-4 w-4" />
                {t('documentGenerator.documentGenerator') || "Générateur de documents"}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 sm:p-6 rounded-xl shadow-sm">
              <DocumentHistory />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHistoryPage;

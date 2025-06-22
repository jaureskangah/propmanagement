
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistory } from "@/components/documents/history/DocumentHistory";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/sidebar/ModernSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const DocumentHistoryContent = () => {
  const { t } = useLocale();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex-1 overflow-auto transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>
      <div className="container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{t('documentGenerator')}</h1>
          </div>

          <div className="space-y-6">
            <DocumentHistory />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DocumentHistoryPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <DocumentHistoryContent />
    </div>
  );
};

export default DocumentHistoryPage;

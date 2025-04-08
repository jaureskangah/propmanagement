
import React, { useState } from 'react';
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { useIsMobile } from "@/hooks/use-mobile";

const TenantDocuments = () => {
  const { t } = useLocale();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isTenant={true} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto pt-20 md:pt-0 md:ml-[270px] md:w-[calc(100%-270px)]">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{t('documentGenerator.documentGenerator') || "Générateur de documents"}</h1>
            </div>

            <div className="pb-16 bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 sm:p-6 rounded-xl shadow-sm">
              <DocumentGenerator />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TenantDocuments;

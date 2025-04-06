
import React, { useState } from 'react';
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";

const TenantDocuments = () => {
  const { t } = useLocale();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar isTenant={true} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{t('documentGenerator')}</h1>
            </div>

            <DocumentGenerator />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TenantDocuments;

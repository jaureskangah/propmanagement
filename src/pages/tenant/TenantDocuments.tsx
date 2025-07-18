
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileText } from "lucide-react";

const TenantDocuments = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isTenant={true} />
      <div className="flex-1 overflow-auto ml-20 p-4 md:p-6 pt-24 md:pt-8 transition-all duration-300">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {t('documentGenerator.documentGenerator')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {t('documentGenerator.description')}
                    </p>
                  </div>
                </div>
              </div>
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

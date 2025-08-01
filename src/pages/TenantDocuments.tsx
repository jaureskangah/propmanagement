
import React, { useState } from 'react';
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileText } from "lucide-react";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const TenantDocuments = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  return (
    <ResponsiveLayout title={t('documentGenerator.documentGenerator')} className="p-4 md:p-6" isTenant={true}>
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
    </ResponsiveLayout>
  );
};

export default TenantDocuments;

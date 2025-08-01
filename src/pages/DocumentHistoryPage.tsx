
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistory } from "@/components/documents/history/DocumentHistory";
import { motion } from "framer-motion";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const DocumentHistoryPage = () => {
  const { t } = useLocale();

  return (
    <ResponsiveLayout title={t('documentGenerator')} className="p-4 md:p-6">
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
    </ResponsiveLayout>
  );
};

export default DocumentHistoryPage;

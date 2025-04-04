
import React from "react";
import { DocumentGeneratorContent } from "./DocumentGeneratorContent";
import AppSidebar from "../AppSidebar";
import { Header } from "./Header";
import { useLocale } from "@/components/providers/LocaleProvider";

const DocumentGeneratorPage = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={t('documentGenerator')} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <DocumentGeneratorContent />
        </main>
      </div>
    </div>
  );
};

export default DocumentGeneratorPage;

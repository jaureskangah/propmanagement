
import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentGenerator as DocGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { History, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/sidebar/ModernSidebar";

const DocumentGeneratorContent = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  return (
    <div className={cn(
      "flex-1 overflow-auto pt-24 md:pt-0 transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>
      <div className="container mx-auto p-4 md:p-6">
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
              <Button 
                variant="outline"
                onClick={() => navigate('/document-history')}
                className="flex items-center gap-2 w-full lg:w-auto"
              >
                <History className="h-4 w-4" />
                {t('documentGenerator.documentHistory')}
              </Button>
            </div>
          </div>

          <div className="pb-16 bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-border/40 p-4 sm:p-6 rounded-xl shadow-sm">
            <DocGenerator />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DocumentGenerator = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <DocumentGeneratorContent />
    </div>
  );
};

export default DocumentGenerator;


import { FileText } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

export const DocumentEmptyState = () => {
  const { t } = useLocale();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-4 sm:p-10 border rounded-lg bg-background/50 backdrop-blur-sm border-border/40 dark:border-gray-700/40"
    >
      <div className="h-12 sm:h-16 w-12 sm:w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 dark:bg-primary/20">
        <FileText className="h-8 sm:h-10 w-8 sm:w-10 text-primary dark:text-primary/80" />
      </div>
      <p className="text-sm sm:text-base font-medium text-foreground">{t("noDocuments")}</p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md text-center">
        {t("uploadAndManageDocuments")}
      </p>
    </motion.div>
  );
};


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
      className="flex flex-col items-center justify-center p-10 border rounded-lg bg-background/50 backdrop-blur-sm border-border/40 dark:border-gray-700/40"
    >
      <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 dark:bg-primary/20">
        <FileText className="h-10 w-10 text-primary dark:text-primary/80" />
      </div>
      <p className="text-base font-medium text-foreground">{t("documents.noDocuments")}</p>
      <p className="text-muted-foreground text-sm mt-2 max-w-md text-center">
        {t("documents.uploadAndManageDocuments")}
      </p>
    </motion.div>
  );
};

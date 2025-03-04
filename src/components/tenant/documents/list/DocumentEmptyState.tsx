
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
      className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg"
    >
      <FileText className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
      <p className="text-muted-foreground">{t("noDocuments") || "Aucun document disponible"}</p>
    </motion.div>
  );
};

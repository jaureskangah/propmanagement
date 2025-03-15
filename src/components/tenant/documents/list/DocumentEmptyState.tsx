
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
      className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg bg-background/50 backdrop-blur-sm"
    >
      <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
      <p className="text-muted-foreground text-base font-medium">{t("noDocuments") || "Aucun document disponible"}</p>
      <p className="text-muted-foreground/70 text-sm mt-2 max-w-md text-center">
        {t("noDocumentsDescription") || "Vous pouvez télécharger des documents importants comme votre bail ou vos quittances."}
      </p>
    </motion.div>
  );
};

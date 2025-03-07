
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";

export const NoActivity = () => {
  const { t } = useLocale();
  
  return (
    <motion.p 
      key="no-activity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-4 text-muted-foreground italic"
    >
      {t('noActivity')}
    </motion.p>
  );
};

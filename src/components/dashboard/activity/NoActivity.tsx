
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Activity } from "lucide-react";

export const NoActivity = () => {
  const { t } = useLocale();
  
  return (
    <motion.div 
      key="no-activity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-8 flex flex-col items-center space-y-4"
    >
      <Activity className="h-12 w-12 text-muted-foreground opacity-40" />
      <p className="text-muted-foreground italic">
        {t('noActivity')}
      </p>
    </motion.div>
  );
};

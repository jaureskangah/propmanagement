
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Activity, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoActivityProps {
  filterType?: string;
  onResetFilter?: () => void;
}

export const NoActivity = ({ filterType = "all", onResetFilter }: NoActivityProps) => {
  const { t } = useLocale();
  
  const isFiltered = filterType !== "all";
  
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
        {isFiltered 
          ? t('noActivityFiltered', { filter: t(filterType) }) 
          : t('noActivity')}
      </p>
      
      {isFiltered && onResetFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilter}
          className="mt-4 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t('resetFilter')}
        </Button>
      )}
    </motion.div>
  );
};

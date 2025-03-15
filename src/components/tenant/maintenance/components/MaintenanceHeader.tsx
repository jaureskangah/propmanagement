
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface MaintenanceHeaderProps {
  onAddClick: () => void;
}

export const MaintenanceHeader = ({ onAddClick }: MaintenanceHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:border-gray-700/40 dark:from-gray-900 dark:to-gray-800/30">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center dark:bg-primary/20">
              <Wrench 
                className="h-6 w-6 text-primary dark:text-primary/90"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans dark:from-blue-400 dark:to-blue-600">
                {t('maintenanceRequestTitle')}
              </h1>
              <p className="text-muted-foreground text-sm font-sans dark:text-gray-400">
                {t('maintenanceRequestDescription', { fallback: t('manageMaintenanceRequests') })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('addNewTask')}
          </Button>
        </div>
      </div>
    </div>
  );
};

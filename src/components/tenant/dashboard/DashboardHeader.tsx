
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DashboardCustomization } from "./DashboardCustomization";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  tenantName: string;
  firstName?: string;
  lastName?: string;
  refreshDashboard: () => void;
  onOrderChange: (order: string[]) => void;
  onVisibilityChange: (hidden: string[]) => void;
  currentOrder: string[];
  hiddenSections: string[];
}

export function DashboardHeader({
  tenantName,
  firstName,
  lastName,
  refreshDashboard,
  onOrderChange,
  onVisibilityChange,
  currentOrder,
  hiddenSections
}: DashboardHeaderProps) {
  const { t } = useLocale();
  
  // Use first name if available, otherwise use full tenant name
  const displayName = firstName || tenantName;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {displayName ? t('welcomeTenant', { name: displayName }) : t('welcomeGeneric')}
          </h1>
          {firstName && lastName && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {lastName}
            </p>
          )}
        </motion.div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshDashboard}
            className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            {t('refresh')}
          </Button>
          
          <DashboardCustomization
            onOrderChange={onOrderChange}
            onVisibilityChange={onVisibilityChange}
            currentOrder={currentOrder}
            hiddenSections={hiddenSections}
          />
        </div>
      </div>
    </div>
  );
}

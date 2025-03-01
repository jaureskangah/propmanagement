
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DashboardCustomizationDialog } from "./customization/DashboardCustomizationDialog";
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

export const DashboardHeader = ({
  tenantName,
  firstName,
  lastName,
  refreshDashboard,
  onOrderChange,
  onVisibilityChange,
  currentOrder,
  hiddenSections
}: DashboardHeaderProps) => {
  const { t } = useLocale();
  
  // Définir le nom d'affichage avec une priorité claire et une valeur par défaut
  let displayName = firstName || tenantName || "";
  
  // Si aucun nom n'est disponible, utiliser un message générique
  const welcomeMessage = displayName 
    ? t('welcomeTenant', { name: displayName }) 
    : t('welcomeGeneric');
  
  return (
    <div className="flex items-center justify-between mb-6 bg-background sticky top-0 z-10 pt-2 pb-4 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600"
      >
        {welcomeMessage}
      </motion.h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshDashboard}
          className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          {t('refresh')}
        </Button>
        <DashboardCustomizationDialog 
          onOrderChange={onOrderChange}
          onVisibilityChange={onVisibilityChange}
          currentOrder={currentOrder}
          hiddenSections={hiddenSections}
        />
      </div>
    </div>
  );
};

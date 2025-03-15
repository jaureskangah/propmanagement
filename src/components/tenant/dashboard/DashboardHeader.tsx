
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DashboardCustomization } from "./DashboardCustomization";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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
    <Card className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-primary"
              >
                <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M12 12H12.01M8 12H8.01M16 12H16.01M12 16H12.01M8 16H8.01M16 16H16.01M12 8H12.01M8 8H8.01M16 8H16.01" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans">
                {displayName ? t('welcomeTenant', { name: displayName }) : t('welcomeGeneric')}
              </h1>
              <p className="text-muted-foreground mt-1 font-sans">
                {t('tenantDashboardSubtitle', { fallback: 'Manage your apartment information and communications' })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshDashboard}
            className="flex items-center gap-1.5 hover:bg-primary/10 transition-all font-sans"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
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
    </Card>
  );
}

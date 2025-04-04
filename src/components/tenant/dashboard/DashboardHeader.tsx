
import { Button } from "@/components/ui/button";
import { Settings, LayoutDashboard, Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DashboardCustomization } from "./DashboardCustomization";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      // First try to get name from props
      let firstNameToUse = firstName || "";
      
      // Then try from user metadata if not provided in props
      if (!firstNameToUse && user?.user_metadata?.first_name) {
        firstNameToUse = user.user_metadata.first_name;
      }
      
      // If still not found and we have a user id, try to get from profiles table
      if (!firstNameToUse && user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
            
          if (data && data.first_name) {
            firstNameToUse = data.first_name;
          }
        } catch (error) {
          console.error("Error fetching tenant profile:", error);
        }
      }
      
      console.log("Tenant dashboard using name:", firstNameToUse);
      setDisplayName(firstNameToUse);
    };
    
    fetchUserProfile();
  }, [firstName, tenantName, user]);
  
  // Determine welcome message based on availability of first name
  const welcomeMessage = displayName
    ? t('welcomeTenant', { name: displayName })
    : t('welcomeGeneric');
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
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
              <LayoutDashboard 
                className="h-6 w-6 text-primary dark:text-primary/90"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans dark:from-blue-400 dark:to-blue-600">
                {welcomeMessage}
              </h1>
              <p className="text-muted-foreground text-sm font-sans dark:text-gray-400">
                {t('manageApartmentInfo', { fallback: 'Manage your apartment information and communications' })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-700 transition-all dark:hover:bg-gray-800 dark:hover:text-blue-400 dark:border-gray-700"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {theme === "dark" ? t('lightMode') : t('darkMode')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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

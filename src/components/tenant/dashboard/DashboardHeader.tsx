
import { LayoutDashboard } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TenantNotificationBell } from "../notifications/TenantNotificationBell";
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
}

export function DashboardHeader({
  tenantName,
  firstName,
  refreshDashboard
}: DashboardHeaderProps) {
  const { t } = useLocale();
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
  
  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:border-gray-800/60 dark:from-gray-900 dark:to-gray-900/80 dark-shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center dark:bg-blue-500/20">
              <LayoutDashboard 
                className="h-6 w-6 text-primary dark:text-blue-400"
              />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-sans dark:from-blue-400 dark:to-indigo-400">
                {welcomeMessage}
              </h1>
              <p className="text-muted-foreground text-sm font-sans dark:text-gray-400">
                {t('manageApartmentInfo', { fallback: 'Manage your apartment information and maintenance' })}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <TenantNotificationBell />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle className="hover:scale-105 transition-transform" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="dark:bg-gray-900 dark:border-gray-800">
                {t('toggleTheme', { fallback: 'Changer de thème' })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

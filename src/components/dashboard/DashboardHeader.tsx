
import { Button } from "@/components/ui/button";
import { DashboardCustomization } from "./DashboardCustomization";
import { DashboardDateFilter, DateRange } from "./DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DashboardHeaderProps {
  title: string;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({ title, onDateRangeChange }: DashboardHeaderProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState<string>("");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      let firstName = user?.user_metadata?.first_name || "";
      console.log("Initial first name from metadata:", firstName);
      
      if (!firstName && user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
            
          console.log("Profile data from database:", data);
          
          if (data && data.first_name) {
            firstName = data.first_name;
            console.log("First name from profiles table:", firstName);
          }
          
          if (error) {
            console.error("Error fetching profile:", error);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        }
      }
      
      console.log("Final first name to display:", firstName);
      setDisplayName(firstName);
      
      if (firstName) {
        console.log("Showing welcome toast for:", firstName);
        toast({
          title: t('success'),
          description: t('welcomeTenant', { name: firstName }),
          duration: 3000,
        });
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user, t, toast]);
  
  console.log("Current displayName in render:", displayName);
  
  const welcomeMessage = displayName
    ? t('welcomeTenant', { name: displayName })
    : t('welcomeGeneric');
    
  console.log("Constructed welcome message:", welcomeMessage);

  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log("DashboardHeader date range changed:", newDateRange);
    onDateRangeChange(newDateRange);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Toggling theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-600/90 to-blue-500/70 backdrop-blur-sm p-6 rounded-xl border border-blue-400/30 shadow-sm dark:border-blue-700/40 dark:from-blue-900 dark:to-blue-800/80 dark:shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center dark:bg-blue-600/30">
            <LayoutDashboard className="h-5 w-5 text-white dark:text-blue-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white dark:text-white">{title}</h1>
            <p className="text-blue-100/90 mt-1 dark:text-blue-200/80">{welcomeMessage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DashboardDateFilter onDateRangeChange={handleDateRangeChange} />
          <DashboardCustomization />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            type="button"
            className="h-9 w-9 bg-white/20 border-white/10 hover:bg-white/30 hover:border-white/20 dark:bg-blue-900/40 dark:border-blue-800/50 dark:hover:bg-blue-800/60 dark:hover:border-blue-700/50"
            title={theme === "dark" ? t('lightMode') : t('darkMode')}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-white" /> : <Moon className="h-4 w-4 text-white" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

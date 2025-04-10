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
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:from-gray-900 dark:to-gray-800/30 dark:border-gray-700/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center dark:bg-primary/20">
            <LayoutDashboard className="h-5 w-5 text-primary dark:text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-600">{title}</h1>
            <p className="text-muted-foreground mt-1 dark:text-gray-400">{welcomeMessage}</p>
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
            className="h-9 w-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title={theme === "dark" ? t('lightMode') : t('darkMode')}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

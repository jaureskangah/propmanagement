
import { DashboardCustomization } from "./DashboardCustomization";
import { DashboardDateFilter, DateRange } from "./DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  title: string;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({ title, onDateRangeChange }: DashboardHeaderProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
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

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{title}</h1>
            <p className="text-muted-foreground mt-1">{welcomeMessage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DashboardDateFilter onDateRangeChange={handleDateRangeChange} />
          <DashboardCustomization />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

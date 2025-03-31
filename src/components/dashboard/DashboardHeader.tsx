
import { Button } from "@/components/ui/button";
import { DashboardCustomization } from "./DashboardCustomization";
import { DashboardDateFilter, DateRange } from "./DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, LayoutDashboard } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({ title, onDateRangeChange }: DashboardHeaderProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Log user information to debug
  useEffect(() => {
    console.log("User in DashboardHeader:", user);
    console.log("First name:", user?.user_metadata?.first_name);
    console.log("Dashboard title:", title);
  }, [user, title]);
  
  // Extraction du prénom de l'utilisateur depuis les métadonnées
  const firstName = user?.user_metadata?.first_name || "";
  
  // Message d'accueil personnalisé
  const welcomeMessage = firstName 
    ? `Bienvenue, ${firstName} !` 
    : "Bienvenue sur votre tableau de bord !";

  // Gestion du changement de plage de dates
  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log("DashboardHeader date range changed:", newDateRange);
    onDateRangeChange(newDateRange);
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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

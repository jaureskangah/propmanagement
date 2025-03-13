
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
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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
          <Button variant="outline" className="hidden md:flex" onClick={toggleTheme} type="button" size="sm">
            {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {theme === "dark" ? t('lightMode') : t('darkMode')}
          </Button>
        </div>
      </div>
    </div>
  );
};

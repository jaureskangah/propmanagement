
import { Button } from "@/components/ui/button";
import { DashboardCustomization } from "./DashboardCustomization";
import { DashboardDateFilter, DateRange } from "./DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

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
  }, [user]);
  
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-lg">{welcomeMessage}</p>
      </div>
      <div className="flex items-center gap-2">
        <DashboardDateFilter onDateRangeChange={handleDateRangeChange} />
        <DashboardCustomization />
        <Button variant="outline" className="hidden md:flex" onClick={toggleTheme} type="button">
          {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {theme === "dark" ? t('lightMode') : t('darkMode')}
        </Button>
      </div>
    </div>
  );
};

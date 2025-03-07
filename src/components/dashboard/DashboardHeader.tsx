
import { Button } from "@/components/ui/button";
import { DashboardCustomization } from "./DashboardCustomization";
import { DashboardDateFilter, DateRange } from "./DashboardDateFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const { t } = useLocale();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date()
  });
  
  // Extraction du prénom de l'utilisateur depuis les métadonnées
  const firstName = user?.user_metadata?.first_name || "";
  
  // Message d'accueil personnalisé
  const welcomeMessage = firstName 
    ? `Bienvenue, ${firstName} !` 
    : "Bienvenue sur votre tableau de bord !";

  const handleDateRangeChange = (newDateRange: DateRange) => {
    console.log("Date range changed:", newDateRange);
    setDateRange(newDateRange);
    // Here you could trigger a data refresh based on the new date range
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-lg">{welcomeMessage}</p>
      </div>
      <div className="flex items-center gap-4">
        <DashboardDateFilter onDateRangeChange={handleDateRangeChange} />
        <DashboardCustomization />
        <Button variant="outline" className="hidden md:flex" type="button">
          {t('dashboard.refresh')}
        </Button>
      </div>
    </div>
  );
};

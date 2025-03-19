
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceHeaderProps {
  onAddClick: () => void;
}

export const MaintenanceHeader = ({ onAddClick }: MaintenanceHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('maintenanceRequests')}</h1>
        <p className="text-muted-foreground">{t('manageMaintenanceRequests')}</p>
      </div>
      <Button 
        onClick={onAddClick}
        className="bg-[#ea384c] hover:bg-[#ea384c]/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('newMaintenanceRequest')}
      </Button>
    </div>
  );
};

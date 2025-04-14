
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MaintenanceHeaderProps {
  onAddClick: () => void;
  sortBy: "newest" | "oldest" | "priority";
  onSortChange: (value: "newest" | "oldest" | "priority") => void;
}

export const MaintenanceHeader = ({ 
  onAddClick, 
  sortBy,
  onSortChange 
}: MaintenanceHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 p-6 rounded-xl border border-border/40 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm shadow-sm dark:bg-gradient-to-r dark:from-gray-950 dark:to-gray-900/80 dark:border-gray-800/60 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
          <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-blue-600/70 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-400">
            {t('maintenanceRequests')}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            {t('manageMaintenanceRequests')}
          </p>
        </div>
      </div>
      <Button 
        onClick={onAddClick}
        className="bg-[#ea384c] hover:bg-[#ea384c]/90 dark:bg-[#ea384c]/90 dark:hover:bg-[#ea384c] transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('newMaintenanceRequest')}
      </Button>
    </div>
  );
};

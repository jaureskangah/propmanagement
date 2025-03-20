
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('maintenanceRequests')}</h1>
          <p className="text-muted-foreground">{t('manageMaintenanceRequests')}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className={sortBy === "newest" ? "bg-muted" : ""}
              onClick={() => onSortChange("newest")}
            >
              {t('newest')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={sortBy === "oldest" ? "bg-muted" : ""}
              onClick={() => onSortChange("oldest")}
            >
              {t('oldest')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={sortBy === "priority" ? "bg-muted" : ""}
              onClick={() => onSortChange("priority")}
            >
              {t('highestPriority')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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


import React from "react";
import { Wrench, Info, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MaintenancePageHeaderProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  urgentRequests: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isMobile: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateTask: () => void;
}

const MaintenancePageHeader = ({
  totalRequests,
  pendingRequests,
  resolvedRequests,
  urgentRequests,
  showFilters,
  setShowFilters,
  isMobile,
  searchQuery,
  setSearchQuery,
  onCreateTask
}: MaintenancePageHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t('maintenanceManagement')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('maintenanceDescription')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <Info className="h-4 w-4 mr-1.5" />
            {totalRequests} {t('maintenanceTasks')}
          </Badge>
          
          <Button 
            size="sm" 
            className="flex items-center gap-1.5" 
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4" />
            + Ajouter une tâche
          </Button>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchTasks')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`transition-colors duration-200 ${
            showFilters ? "bg-primary/10 text-primary" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MaintenancePageHeader;


import React from "react";
import { Wrench, Info, Search, Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Input } from "@/components/ui/input";
import { YearFilter } from "@/components/finances/YearFilter";
import PropertyFinancialSelector from "@/components/finances/PropertyFinancialSelector";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";

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
  onPropertySelect: (propertyId: string) => void;
  onYearChange: (year: number) => void;
  selectedPropertyId: string;
  selectedYear: number;
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
  onCreateTask,
  onPropertySelect,
  onYearChange,
  selectedPropertyId,
  selectedYear
}: MaintenancePageHeaderProps) => {
  const { t } = useLocale();
  const { properties, isLoading } = useProperties();

  return (
    <div className="mb-8 bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm dark:bg-gradient-to-r dark:from-gray-950 dark:to-gray-900/80 dark:border-gray-800/60 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-blue-500/20 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {t('maintenanceManagement')}
            </h1>
            <p className="text-muted-foreground mt-1 dark:text-gray-400">
              {t('maintenanceDescription')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PropertyFinancialSelector
            properties={properties}
            isLoading={isLoading}
            selectedPropertyId={selectedPropertyId}
            onPropertySelect={onPropertySelect}
          />
          <YearFilter
            selectedYear={selectedYear}
            onYearChange={onYearChange}
          />
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchMaintenanceRequests')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 dark:bg-gray-800/60 dark:border-gray-700/80"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`transition-colors duration-200 dark:bg-gray-800/60 dark:border-gray-700/80 dark:hover:bg-gray-800/90 ${
            showFilters ? "bg-primary/10 text-primary dark:bg-blue-500/20" : ""
          }`}
        >
          <Filter className="h-4 w-4 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};

export default MaintenancePageHeader;

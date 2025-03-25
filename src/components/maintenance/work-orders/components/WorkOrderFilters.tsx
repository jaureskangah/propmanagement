
import { Search, Building, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface WorkOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: "date" | "cost";
  setSortBy: (value: "date" | "cost") => void;
  buildingFilter?: string;
  setBuildingFilter?: (value: string) => void;
  problemTypeFilter?: string;
  setProblemTypeFilter?: (value: string) => void;
  buildings?: string[];
  problemTypes?: string[];
  onSaveFilter?: () => void;
}

export const WorkOrderFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  sortBy,
  setSortBy,
  buildingFilter = "all",
  setBuildingFilter = () => {},
  problemTypeFilter = "all",
  setProblemTypeFilter = () => {},
  buildings = [],
  problemTypes = [],
  onSaveFilter
}: WorkOrderFiltersProps) => {
  const { t } = useLocale();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterName, setFilterName] = useState("");
  
  // Count active filters
  const activeFilterCount = [
    statusFilter !== "all" ? 1 : 0,
    buildingFilter !== "all" ? 1 : 0,
    problemTypeFilter !== "all" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 transition-all duration-300 hover:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary bg-background">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="In Progress">{t('statusInProgress')}</SelectItem>
              <SelectItem value="Scheduled">{t('statusPending')}</SelectItem>
              <SelectItem value="Completed">{t('statusCompleted')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary bg-background">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t('date')}</SelectItem>
              <SelectItem value="cost">{t('cost')}</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant={showAdvanced ? "secondary" : "outline"} 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative"
          >
            {t('filters')}
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <div className="p-4 border rounded-md bg-muted/20 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Building filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                {t('filterByBuilding')}
              </label>
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectBuilding')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allBuildings')}</SelectItem>
                  {buildings.map(building => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Problem type filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {t('filterByProblemType')}
              </label>
              <Select value={problemTypeFilter} onValueChange={setProblemTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectProblemType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allProblemTypes')}</SelectItem>
                  {problemTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save filter option */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Input
              placeholder={t('saveFilterName')}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (onSaveFilter && filterName.trim()) {
                  onSaveFilter();
                  setFilterName("");
                }
              }}
              disabled={!filterName.trim()}
            >
              {t('saveFilter')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

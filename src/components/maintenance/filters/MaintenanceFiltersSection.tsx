
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Clock } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceFiltersSectionProps {
  showFilters: boolean;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  statuses: readonly string[];
  priorities: readonly string[];
}

const MaintenanceFiltersSection = ({
  showFilters,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  statuses,
  priorities
}: MaintenanceFiltersSectionProps) => {
  const { t } = useLocale();

  if (!showFilters) return null;

  // Make sure we filter out any empty strings
  const validStatuses = statuses.filter(status => status && status.trim() !== "");
  const validPriorities = priorities.filter(priority => priority && priority.trim() !== "");

  return (
    <div className="mb-6 p-4 border rounded-lg bg-background shadow-sm animate-fade-in space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t('status')}</h4>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('filterByStatus')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {validStatuses.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="cursor-pointer"
                >
                  {status === "All" ? t('filterByStatus') : t(status.toLowerCase().replace(' ', ''))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t('priority')}</h4>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('filterByPriority')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {validPriorities.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="cursor-pointer"
                >
                  {priority === "All" ? t('filterByPriority') : t(priority.toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceFiltersSection;

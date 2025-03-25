
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: "date" | "cost";
  setSortBy: (value: "date" | "cost") => void;
}

export const WorkOrderFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  sortBy,
  setSortBy
}: WorkOrderFiltersProps) => {
  const { t } = useLocale();

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
      </div>
    </div>
  );
};

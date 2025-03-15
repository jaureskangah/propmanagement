
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: "newest" | "oldest" | "priority";
  onSortChange: (value: "newest" | "oldest" | "priority") => void;
}

export const MaintenanceFilters = ({ 
  statusFilter, 
  onStatusChange, 
  sortBy, 
  onSortChange 
}: MaintenanceFiltersProps) => {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('filterBy')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allStatuses')}</SelectItem>
          <SelectItem value="Pending">{t('pending')}</SelectItem>
          <SelectItem value="In Progress">{t('inProgress')}</SelectItem>
          <SelectItem value="Resolved">{t('resolved')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={value => onSortChange(value as "newest" | "oldest" | "priority")}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('sortBy')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t('newest')}</SelectItem>
          <SelectItem value="oldest">{t('oldest')}</SelectItem>
          <SelectItem value="priority">{t('highestPriority')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

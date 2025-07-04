
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MaintenanceSearch = ({ 
  searchQuery, 
  onSearchChange 
}: MaintenanceSearchProps) => {
  const { t } = useLocale();
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('searchMaintenanceRequests')}
        className="w-full pl-9 dark:bg-gray-800/60 dark:border-gray-700/80"
      />
    </div>
  );
};

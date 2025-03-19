
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MaintenanceSearch = ({
  searchQuery,
  onSearchChange
}: MaintenanceSearchProps) => {
  const { t } = useLocale();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        placeholder={t('searchMaintenanceRequests')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8 transition-all duration-300 hover:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
};

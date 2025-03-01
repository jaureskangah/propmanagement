
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('searchPlaceholder')}
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

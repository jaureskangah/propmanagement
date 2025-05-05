
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChangeEventHandler } from "react";

// Add SearchFilters interface
export interface SearchFilters {
  propertyId: string | null;
  leaseStatus: "all" | "active" | "expiring" | "expired";
}

interface TenantSearchProps {
  searchQuery: string;
  onChange: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  filters?: SearchFilters;
}

export function TenantSearch({ searchQuery, onChange, onFilterChange, filters }: TenantSearchProps) {
  const { t } = useLocale();
  
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t('list.searchTenants')}
        className="w-full pl-8 md:w-[250px]"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
}

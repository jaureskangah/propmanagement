
import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface SearchFilters {
  propertyId: string | null;
  leaseStatus: 'all' | 'active' | 'expiring' | 'expired';
}

interface TenantSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const TenantSearch = ({
  value,
  onChange,
  onFilterChange,
  filters,
}: TenantSearchProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { t } = useLocale();

  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      leaseStatus: status as SearchFilters['leaseStatus'],
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.leaseStatus !== 'all') count++;
    if (filters.propertyId) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-9 pr-4"
          placeholder={t('searchTenants')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 gap-1 relative"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('filters')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs absolute -top-2 -right-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="font-medium">{t('leaseStatus')}</div>
              <Select
                value={filters.leaseStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('active')}</SelectItem>
                  <SelectItem value="expiring">{t('expiring')}</SelectItem>
                  <SelectItem value="expired">{t('expired')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onFilterChange({
                      propertyId: null,
                      leaseStatus: 'all',
                    })
                  }
                >
                  {t('resetFilters')}
                </Button>
                <Button size="sm" onClick={() => setIsFiltersOpen(false)}>
                  {t('applyFilters')}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.leaseStatus !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t(filters.leaseStatus)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

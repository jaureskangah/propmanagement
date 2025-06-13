
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export interface SearchFilters {
  property: string;
  status: string;
  rentRange: [number, number];
  propertyId: string;
  leaseStatus: string;
}

interface TenantSearchProps {
  searchQuery: string;
  onChange: (value: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const TenantSearch = ({ 
  searchQuery, 
  onChange, 
  onFilterChange, 
  filters 
}: TenantSearchProps) => {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('searchTenants')}
          value={searchQuery}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        {t('filters')}
      </Button>
    </div>
  );
};

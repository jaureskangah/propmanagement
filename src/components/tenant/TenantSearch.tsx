
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useProperties } from "@/hooks/useProperties";

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { properties, isLoading: propertiesLoading } = useProperties();

  const handlePropertyChange = (propertyId: string) => {
    const selectedProperty = properties?.find(p => p.id === propertyId);
    onFilterChange({
      ...filters,
      propertyId: propertyId === "all" ? "" : propertyId,
      property: propertyId === "all" ? "" : (selectedProperty?.name || "")
    });
  };

  const clearFilters = () => {
    onFilterChange({
      property: "",
      status: "",
      rentRange: [0, 5000],
      propertyId: "",
      leaseStatus: "",
    });
  };

  const hasActiveFilters = filters.propertyId || filters.property || filters.status || filters.leaseStatus;

  return (
    <div className="space-y-4">
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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={hasActiveFilters ? "border-primary bg-primary/5" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('filters')}
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              1
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {filtersOpen && (
        <Card className="border-t-0 rounded-t-none">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Filtrer par propriété
                </label>
                <Select
                  value={filters.propertyId || "all"}
                  onValueChange={handlePropertyChange}
                  disabled={propertiesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une propriété" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md">
                    <SelectItem value="all">Toutes les propriétés</SelectItem>
                    {properties?.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

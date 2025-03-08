
import React from "react";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFiltersProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  propertyTypes: readonly string[];
  compact?: boolean;
}

const PropertyFilters = ({
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  propertyTypes,
  compact = false,
}: PropertyFiltersProps) => {
  const { t } = useLocale();

  if (compact) {
    return (
      <div className="w-full relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchProperties')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative flex gap-2">
        <div className="w-full sm:w-64">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('filterByType')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="cursor-pointer"
                >
                  {type === "All" ? t('filterByType') : t(type.toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('searchProperties')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;


import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyFiltersSectionProps {
  showFilters: boolean;
  selectedType: string;
  setSelectedType: (type: string) => void;
  propertyTypes: readonly string[];
}

const PropertyFiltersSection = ({
  showFilters,
  selectedType,
  setSelectedType,
  propertyTypes
}: PropertyFiltersSectionProps) => {
  const { t } = useLocale();

  if (!showFilters) return null;

  return (
    <div className="mb-6 p-4 border rounded-lg bg-background shadow-sm animate-fade-in space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{t('propertyType')}</h4>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-64">
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
    </div>
  );
};

export default PropertyFiltersSection;

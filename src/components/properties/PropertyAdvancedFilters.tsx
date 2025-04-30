
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, RefreshCw } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyAdvancedFiltersProps {
  occupancyFilter: string;
  setOccupancyFilter: (value: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  amenities: string[];
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  resetFilters: () => void;
}

const PropertyAdvancedFilters = ({
  occupancyFilter,
  setOccupancyFilter,
  priceRange,
  setPriceRange,
  amenities,
  selectedAmenities,
  toggleAmenity,
  resetFilters
}: PropertyAdvancedFiltersProps) => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPriceRange({ ...priceRange, min: value });
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPriceRange({ ...priceRange, max: value });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="mb-4 border rounded-lg bg-card"
      value={isOpen ? "advanced-filters" : ""}
      onValueChange={(value) => setIsOpen(!!value)}
    >
      <AccordionItem value="advanced-filters" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('advancedFilters')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 animate-accordion-down">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('occupancyStatus')}</label>
                <Select value={occupancyFilter} onValueChange={setOccupancyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStatuses')}</SelectItem>
                    <SelectItem value="occupied">{t('occupied')}</SelectItem>
                    <SelectItem value="vacant">{t('vacant')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('priceRange')}</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      type="text"
                      placeholder={t('minPrice')}
                      value={priceRange.min}
                      onChange={handleMinPriceChange}
                      className="pl-6"
                    />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      type="text"
                      placeholder={t('maxPrice')}
                      value={priceRange.max}
                      onChange={handleMaxPriceChange}
                      className="pl-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('amenities')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {amenities.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm cursor-pointer"
                    >
                      {t(amenity.toLowerCase().replace(' ', ''))}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t('resetFilters')}
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PropertyAdvancedFilters;

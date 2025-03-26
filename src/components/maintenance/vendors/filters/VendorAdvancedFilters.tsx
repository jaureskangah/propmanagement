
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface VendorAdvancedFiltersProps {
  specialties: string[];
  selectedSpecialty: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
  selectedRating: string | null;
  onRatingChange: (rating: string | null) => void;
  showEmergencyOnly: boolean;
  onEmergencyChange: (show: boolean) => void;
  showAvailableOnly: boolean;
  onAvailableChange: (show: boolean) => void;
  selectedAvailability: string | null;
  onAvailabilityChange: (availability: string | null) => void;
}

export const VendorAdvancedFilters = ({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
  selectedRating,
  onRatingChange,
  showEmergencyOnly,
  onEmergencyChange,
  showAvailableOnly,
  onAvailableChange,
  selectedAvailability,
  onAvailabilityChange
}: VendorAdvancedFiltersProps) => {
  const { t } = useLocale();
  
  // Calculer le nombre de filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSpecialty) count++;
    if (selectedRating) count++;
    if (showEmergencyOnly) count++;
    if (showAvailableOnly) count++;
    if (selectedAvailability) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            {t('advancedFilters')}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">{t('specialty')}</Label>
              <Select 
                value={selectedSpecialty || ""}
                onValueChange={(value) => onSpecialtyChange(value === "" ? null : value)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder={t('allSpecialties')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allSpecialties')}</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">{t('rating')}</Label>
              <Select 
                value={selectedRating || ""}
                onValueChange={(value) => onRatingChange(value === "" ? null : value)}
              >
                <SelectTrigger id="rating">
                  <SelectValue placeholder={t('allRatings')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allRatings')}</SelectItem>
                  <SelectItem value="4">4+ {t('stars')}</SelectItem>
                  <SelectItem value="3">3+ {t('stars')}</SelectItem>
                  <SelectItem value="2">2+ {t('stars')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">{t('availability')}</Label>
              <Select 
                value={selectedAvailability || ""}
                onValueChange={(value) => onAvailabilityChange(value === "" ? null : value)}
              >
                <SelectTrigger id="availability">
                  <SelectValue placeholder={t('anyAvailability')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('anyAvailability')}</SelectItem>
                  <SelectItem value="today">{t('availableToday')}</SelectItem>
                  <SelectItem value="this-week">{t('availableThisWeek')}</SelectItem>
                  <SelectItem value="next-week">{t('availableNextWeek')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emergency-only" 
                checked={showEmergencyOnly}
                onCheckedChange={(checked) => onEmergencyChange(checked === true)}
              />
              <Label htmlFor="emergency-only" className="text-sm cursor-pointer">
                {t('emergencyContactsOnly')}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="available-only" 
                checked={showAvailableOnly}
                onCheckedChange={(checked) => onAvailableChange(checked === true)}
              />
              <Label htmlFor="available-only" className="text-sm cursor-pointer">
                {t('availableNow')}
              </Label>
            </div>
            
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-xs h-7"
                onClick={() => {
                  onSpecialtyChange(null);
                  onRatingChange(null);
                  onEmergencyChange(false);
                  onAvailableChange(false);
                  onAvailabilityChange(null);
                }}
              >
                {t('clearAllFilters')}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

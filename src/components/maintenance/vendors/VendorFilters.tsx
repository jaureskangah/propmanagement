
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorFiltersProps {
  specialties: string[];
  selectedSpecialty: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRating: string | null;
  onRatingChange: (rating: string | null) => void;
  showEmergencyOnly: boolean;
  onEmergencyChange: (show: boolean) => void;
}

export const VendorFilters = ({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
  searchQuery,
  onSearchChange,
  selectedRating,
  onRatingChange,
  showEmergencyOnly,
  onEmergencyChange,
}: VendorFiltersProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchVendors')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedSpecialty === null ? "default" : "outline"}
          onClick={() => onSpecialtyChange(null)}
        >
          {t('allSpecialties')}
        </Button>
        {specialties.map(specialty => (
          <Button
            key={specialty}
            variant={selectedSpecialty === specialty ? "default" : "outline"}
            onClick={() => onSpecialtyChange(specialty)}
          >
            {specialty}
          </Button>
        ))}
      </div>

      <div className="flex gap-4">
        <Select
          value={selectedRating ?? "all"}
          onValueChange={(value) => onRatingChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('filterByRating')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRatings')}</SelectItem>
            <SelectItem value="4">{t('fourPlusStars')}</SelectItem>
            <SelectItem value="3">{t('threePlusStars')}</SelectItem>
            <SelectItem value="2">{t('twoPlusStars')}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showEmergencyOnly ? "default" : "outline"}
          onClick={() => onEmergencyChange(!showEmergencyOnly)}
          className="gap-2"
        >
          {showEmergencyOnly ? t('allVendors') : t('emergencyOnly')}
        </Button>
      </div>
    </div>
  );
};

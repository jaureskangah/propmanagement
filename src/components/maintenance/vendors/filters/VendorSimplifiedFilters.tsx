
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorSimplifiedFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSpecialty: string | null;
  setSelectedSpecialty: (value: string | null) => void;
  selectedRating: string | null;
  setSelectedRating: (value: string | null) => void;
  showEmergencyOnly: boolean;
  setShowEmergencyOnly: (value: boolean) => void;
  specialties: string[];
}

export const VendorSimplifiedFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedRating,
  setSelectedRating,
  showEmergencyOnly,
  setShowEmergencyOnly,
  specialties
}: VendorSimplifiedFiltersProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t('searchVendors')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Select
          value={selectedSpecialty || "all"}
          onValueChange={(value) => setSelectedSpecialty(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('allSpecialties')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSpecialties')}</SelectItem>
            {specialties.map(specialty => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedRating || "all"}
          onValueChange={(value) => setSelectedRating(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('allRatings')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRatings')}</SelectItem>
            <SelectItem value="4">{t('fourPlusStars')}</SelectItem>
            <SelectItem value="3">{t('threePlusStars')}</SelectItem>
            <SelectItem value="2">{t('twoPlusStars')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            id="emergency-only"
            checked={showEmergencyOnly}
            onCheckedChange={setShowEmergencyOnly}
          />
          <Label htmlFor="emergency-only">{t('emergencyOnly')}</Label>
        </div>
      </div>
    </div>
  );
};

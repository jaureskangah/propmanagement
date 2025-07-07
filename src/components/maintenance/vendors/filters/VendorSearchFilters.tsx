
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedRating: string | null;
  setSelectedRating: (value: string | null) => void;
  showEmergencyOnly: boolean;
  setShowEmergencyOnly: (value: boolean) => void;
}

export const VendorSearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedRating,
  setSelectedRating,
  showEmergencyOnly,
  setShowEmergencyOnly,
}: VendorSearchFiltersProps) => {
  const { t } = useLocale();

  return (
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
        value={selectedRating || "all"}
        onValueChange={(value) => setSelectedRating(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('filterByRating')} />
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
  );
};

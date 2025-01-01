import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VendorSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRating: string | null;
  onRatingChange: (rating: string | null) => void;
  showEmergencyOnly: boolean;
  onEmergencyChange: (show: boolean) => void;
}

export const VendorSearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedRating,
  onRatingChange,
  showEmergencyOnly,
  onEmergencyChange,
}: VendorSearchFiltersProps) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search vendors..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Select
            value={selectedRating?.toString() || ""}
            onValueChange={(value) => onRatingChange(value ? value : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating}+ stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="emergency-only"
            checked={showEmergencyOnly}
            onCheckedChange={onEmergencyChange}
          />
          <Label htmlFor="emergency-only">Emergency contacts only</Label>
        </div>
      </div>
    </div>
  );
};
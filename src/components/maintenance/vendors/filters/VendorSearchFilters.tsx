import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex gap-4">
        <Select
          value={selectedRating || "all"}
          onValueChange={(value) => setSelectedRating(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="2">2+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
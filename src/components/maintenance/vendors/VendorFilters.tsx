import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un prestataire..."
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
          Toutes les spécialités
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
            <SelectValue placeholder="Filtrer par note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            <SelectItem value="4">4+ étoiles</SelectItem>
            <SelectItem value="3">3+ étoiles</SelectItem>
            <SelectItem value="2">2+ étoiles</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showEmergencyOnly ? "default" : "outline"}
          onClick={() => onEmergencyChange(!showEmergencyOnly)}
          className="gap-2"
        >
          {showEmergencyOnly ? "Tous les prestataires" : "Contacts d'urgence uniquement"}
        </Button>
      </div>
    </div>
  );
};
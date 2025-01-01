import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ExpensesFiltersProps {
  period: string;
  setPeriod: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const ExpensesFilters = ({
  period,
  setPeriod,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: ExpensesFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtre par période */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les périodes</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>

        {/* Tri */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (récent)</SelectItem>
            <SelectItem value="date-asc">Date (ancien)</SelectItem>
            <SelectItem value="amount-desc">Montant (élevé)</SelectItem>
            <SelectItem value="amount-asc">Montant (faible)</SelectItem>
            <SelectItem value="category">Catégorie</SelectItem>
          </SelectContent>
        </Select>

        {/* Recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher des dépenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
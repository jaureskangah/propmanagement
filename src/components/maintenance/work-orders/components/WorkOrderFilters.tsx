
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface WorkOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: "date" | "cost";
  setSortBy: (value: "date" | "cost") => void;
}

export const WorkOrderFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  sortBy,
  setSortBy
}: WorkOrderFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher par titre ou propriété..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Planifié">Planifié</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort selection */}
        <div className="w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(value: "date" | "cost") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="cost">Coût</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

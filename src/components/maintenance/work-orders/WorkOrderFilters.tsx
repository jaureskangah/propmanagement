
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, Search, DollarSign } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

interface WorkOrderFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: "date" | "cost" | "priority";
  setSortBy: (sort: "date" | "cost" | "priority") => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  vendorSearch: string;
  setVendorSearch: (vendor: string) => void;
}

export const WorkOrderFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  priorityFilter,
  setPriorityFilter,
  vendorSearch,
  setVendorSearch
}: WorkOrderFiltersProps) => {
  return (
    <div className="space-y-4 mb-6 bg-background p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search for work orders */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une demande de maintenance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Vendor search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un prestataire..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Status filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Planifié">Planifié</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="Haute">Haute</SelectItem>
            <SelectItem value="Moyenne">Moyenne</SelectItem>
            <SelectItem value="Basse">Basse</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort by */}
        <Select value={sortBy} onValueChange={(value: "date" | "cost" | "priority") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="cost">Coût</SelectItem>
            <SelectItem value="priority">Priorité</SelectItem>
          </SelectContent>
        </Select>

        {/* Date range picker */}
        <div className="flex-1">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            align="start"
            locale="fr"
          />
        </div>
      </div>
    </div>
  );
};

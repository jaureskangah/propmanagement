
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, Search, DollarSign, Info } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const isMobile = useIsMobile();

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("date");
    setDateRange({ from: undefined, to: undefined });
    setPriorityFilter("all");
    setVendorSearch("");
  };

  // Mobile filters in a drawer
  if (isMobile) {
    return (
      <div className="space-y-4 mb-6 bg-background p-4 rounded-lg border">
        <div className="flex flex-col gap-4">
          {/* Search for work orders */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une demande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 mobile-full-width"
              />
            </div>
          </div>

          <div className="flex justify-between">
            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[125px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Advanced filters in drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-4 pb-6 pt-2">
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium mb-2">Filtres avancés</h4>
                  
                  {/* Priority filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priorité</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les priorités</SelectItem>
                        <SelectItem value="Haute">Haute</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vendor search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prestataire</label>
                    <Input
                      placeholder="Rechercher un prestataire..."
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                    />
                  </div>

                  {/* Date range picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Période</label>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      align="start"
                      locale="fr"
                      className="w-full"
                    />
                  </div>

                  {/* Sort by */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trier par</label>
                    <Select value={sortBy} onValueChange={(value: "date" | "cost" | "priority") => setSortBy(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="cost">Coût</SelectItem>
                        <SelectItem value="priority">Priorité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout with tooltips
  return (
    <TooltipProvider>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-2 top-3">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="w-[220px] text-sm">
                    Recherchez par nom de prestataire pour filtrer les demandes associées
                  </p>
                </TooltipContent>
              </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
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
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="w-[180px] text-sm">
                Filtrer les demandes par leur statut actuel
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Priority filter */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
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
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="w-[180px] text-sm">
                Niveau d'urgence des interventions à afficher
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Sort by */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
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
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="w-[180px] text-sm">
                Changer l'ordre d'affichage des demandes
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Date range picker */}
          <div className="flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    align="start"
                    locale="fr"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="w-[220px] text-sm">
                  Sélectionnez une période pour filtrer les demandes par date
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

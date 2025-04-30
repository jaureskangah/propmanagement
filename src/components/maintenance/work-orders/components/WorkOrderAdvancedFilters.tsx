
import React from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckIcon, FilterIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderAdvancedFiltersProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  vendorSearch: string;
  setVendorSearch: (vendor: string) => void;
  resetFilters: () => void;
}

export const WorkOrderAdvancedFilters = ({
  dateRange,
  setDateRange,
  priorityFilter,
  setPriorityFilter,
  vendorSearch,
  setVendorSearch,
  resetFilters
}: WorkOrderAdvancedFiltersProps) => {
  const { t } = useLocale();

  return (
    <Accordion type="single" collapsible className="mb-6 border rounded-lg bg-card">
      <AccordionItem value="advanced-filters" className="border-none">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">Filtres avancés</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plage de dates</label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  align="start"
                  locale="fr"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les priorités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prestataire</label>
              <Input
                placeholder="Rechercher un prestataire..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

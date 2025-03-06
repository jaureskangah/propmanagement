
import { Search, SlidersHorizontal } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterPanel } from "./FilterPanel";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TabHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

export function TabHeader({
  searchQuery,
  setSearchQuery,
  selectedDocType,
  setSelectedDocType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filtersOpen,
  setFiltersOpen
}: TabHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <TabsList>
        <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
        <TabsTrigger value="upload">{t("uploadNewDocument")}</TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchDocuments")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="icon" title={t("filterDocuments")}>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute z-10 right-0 mt-2 p-4 bg-background border rounded-lg shadow-lg w-full sm:w-auto">
            <FilterPanel 
              selectedDocType={selectedDocType}
              setSelectedDocType={setSelectedDocType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

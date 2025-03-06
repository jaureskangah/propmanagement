
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FilterPanel } from "./FilterPanel";

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
  isMobile?: boolean;
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
  setFiltersOpen,
  isMobile = false
}: TabHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tabs with "All Documents" button removed */}
        
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchDocuments")}
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size="sm"
            className="h-9 gap-1"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {filtersOpen ? (
              <>
                <X className="h-4 w-4" />
                {!isMobile && t("hideFilters")}
              </>
            ) : (
              <>
                <Filter className="h-4 w-4" />
                {!isMobile && "Show Filters"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {filtersOpen && (
        <FilterPanel
          selectedDocType={selectedDocType}
          setSelectedDocType={setSelectedDocType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}
    </div>
  );
}

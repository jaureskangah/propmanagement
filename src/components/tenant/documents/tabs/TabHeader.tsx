
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FilterPanel } from "./FilterPanel";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobileDevice = useIsMobile();
  const actualIsMobile = isMobile || isMobileDevice;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchDocuments")}
              className="pl-8 h-8 sm:h-9 text-xs sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button
            variant={filtersOpen ? "default" : "outline"}
            size={actualIsMobile ? "sm" : "default"}
            className="h-8 sm:h-9 gap-1 text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {filtersOpen ? (
              <>
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                {!actualIsMobile && t("hideFilters")}
              </>
            ) : (
              <>
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                {!actualIsMobile && t("showFilters")}
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
          isMobile={actualIsMobile}
        />
      )}
    </div>
  );
}

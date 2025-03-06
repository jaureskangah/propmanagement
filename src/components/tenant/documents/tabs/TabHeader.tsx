
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, X } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" className="text-sm">
              {t("allDocuments")}
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-sm">
              {t("uploadDocument")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[260px]">
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
                {!isMobile && t("showFilters")}
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

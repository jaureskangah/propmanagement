
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface DocumentsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDocType: string | null;
  setSelectedDocType: (type: string | null) => void;
  sortBy: "date" | "name";
  setSortBy: (sortBy: "date" | "name") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export const DocumentsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedDocType,
  setSelectedDocType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: DocumentsFiltersProps) => {
  const { t } = useLocale();

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchDocuments")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedDocType || ""}
          onValueChange={(value) => setSelectedDocType(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("filterDocuments")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {t("allDocuments")}
            </SelectItem>
            <SelectItem value="lease">
              {t("leaseDocuments")}
            </SelectItem>
            <SelectItem value="receipt">
              {t("paymentReceipts")}
            </SelectItem>
            <SelectItem value="other">
              {t("otherDocuments")}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "date" | "name")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">
              {t("dateUploaded")}
            </SelectItem>
            <SelectItem value="name">
              {t("documentName")}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSortOrder}
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          <ArrowUpDown className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "" : "rotate-180"}`} />
        </Button>
      </div>
    </motion.div>
  );
};

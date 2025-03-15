
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FilterPanelProps {
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  isMobile?: boolean;
}

export function FilterPanel({
  selectedDocType,
  setSelectedDocType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isMobile = false
}: FilterPanelProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex-1">
        <label className="text-xs sm:text-sm font-medium mb-1 block">
          {t("documentType")}
        </label>
        <Select value={selectedDocType} onValueChange={setSelectedDocType}>
          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
            <SelectValue placeholder={t("filterDocuments")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDocuments")}</SelectItem>
            <SelectItem value="lease">{t("leaseDocuments")}</SelectItem>
            <SelectItem value="receipt">{t("paymentReceipts")}</SelectItem>
            <SelectItem value="other">{t("otherDocuments")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label className="text-xs sm:text-sm font-medium mb-1 block">
          {t("sortBy")}
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">{t("dateUploaded")}</SelectItem>
            <SelectItem value="name">{t("documentName")}</SelectItem>
            <SelectItem value="document_type">{t("documentType")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label className="text-xs sm:text-sm font-medium mb-1 block">
          {t("order")}
        </label>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

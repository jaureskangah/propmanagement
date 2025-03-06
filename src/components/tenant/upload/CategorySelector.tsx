
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const CategorySelector = ({ selectedCategory, onCategoryChange }: CategorySelectorProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("category")}</label>
      <Select 
        value={selectedCategory} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="important">{t("importantDocuments")}</SelectItem>
          <SelectItem value="lease">{t("leaseDocuments")}</SelectItem>
          <SelectItem value="receipt">{t("paymentReceipts")}</SelectItem>
          <SelectItem value="other">{t("otherDocuments")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

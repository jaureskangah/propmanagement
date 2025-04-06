
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
}

export const DocumentFilters = ({ 
  searchTerm, 
  onSearchChange, 
  categoryFilter, 
  onCategoryChange 
}: DocumentFiltersProps) => {
  const { t } = useLocale();
  
  const categories = [
    { value: "all", label: t('allTemplates') },
    { value: "leaseDocuments", label: t('leaseDocuments') },
    { value: "paymentDocuments", label: t('paymentDocuments') },
    { value: "noticeDocuments", label: t('noticeDocuments') },
    { value: "inspectionDocuments", label: t('inspectionDocuments') },
    { value: "miscDocuments", label: t('miscDocuments') }
  ];
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder={t('search')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:w-1/2"
      />
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="md:w-1/3">
          <SelectValue placeholder={t('category')} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

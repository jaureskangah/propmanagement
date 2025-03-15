
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Receipt, Star } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocument } from "@/types/tenant";

interface DocumentCategoriesProps {
  documents: TenantDocument[] | undefined;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isCompact?: boolean;
}

export function DocumentCategories({
  documents = [],
  selectedCategory,
  onCategoryChange,
  isCompact = false
}: DocumentCategoriesProps) {
  const { t } = useLocale();

  // Count documents by category
  const getCategoryCount = (category: string) => {
    if (!documents) return 0;
    return documents.filter(doc => {
      if (category === 'all') return true;
      if (category === 'important') return doc.category === 'important';
      if (category === 'lease') return doc.document_type === 'lease';
      if (category === 'receipt') return doc.document_type === 'receipt';
      if (category === 'other') return doc.document_type === 'other' && doc.category !== 'important';
      return false;
    }).length;
  };

  // Define categories with their icons and counts
  const categories = [
    { id: 'all', label: t('allDocuments'), icon: FileText, count: getCategoryCount('all') },
    { id: 'important', label: t('importantDocuments'), icon: Star, count: getCategoryCount('important') },
    { id: 'lease', label: t('leaseDocuments'), icon: Calendar, count: getCategoryCount('lease') },
    { id: 'receipt', label: t('paymentReceipts'), icon: Receipt, count: getCategoryCount('receipt') },
    { id: 'other', label: t('otherDocuments'), icon: FileText, count: getCategoryCount('other') }
  ];

  return (
    <div className={`${isCompact 
        ? 'flex overflow-x-auto pb-2 hide-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0' 
        : 'w-56 space-y-1'}`}
    >
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "ghost"}
          className={`justify-start ${
            isCompact 
              ? 'mr-2 w-auto flex-shrink-0 text-xs px-2 h-8 sm:text-sm sm:px-3 sm:h-9' 
              : 'w-full'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          <category.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="truncate">{category.label}</span>
          {category.count > 0 && (
            <span className="ml-1 sm:ml-auto bg-muted text-muted-foreground text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
              {category.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}


import { useState } from "react";
import { Folder, FolderOpen, Tag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

interface DocumentCategoriesProps {
  documents: any[] | undefined;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const DocumentCategories = ({
  documents,
  selectedCategory,
  onCategoryChange
}: DocumentCategoriesProps) => {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(true);

  // Count documents per category
  const getCategoryCount = (categoryId: string) => {
    if (!documents) return 0;
    if (categoryId === "all") return documents.length;
    
    return documents.filter(doc => {
      if (categoryId === "uncategorized") {
        return !doc.category || doc.category === "";
      }
      return doc.category === categoryId;
    }).length;
  };

  // Define standard categories
  const standardCategories: Category[] = [
    {
      id: "all",
      name: t("allDocuments"),
      icon: <Folder className="h-4 w-4 text-blue-500" />,
      count: getCategoryCount("all")
    },
    {
      id: "important",
      name: t("importantDocuments"),
      icon: <Tag className="h-4 w-4 text-red-500" />,
      count: getCategoryCount("important")
    },
    {
      id: "lease",
      name: t("leaseDocuments"),
      icon: <Folder className="h-4 w-4 text-green-500" />,
      count: getCategoryCount("lease")
    },
    {
      id: "receipt",
      name: t("paymentReceipts"),
      icon: <Folder className="h-4 w-4 text-amber-500" />,
      count: getCategoryCount("receipt")
    },
    {
      id: "uncategorized",
      name: t("uncategorized"),
      icon: <Folder className="h-4 w-4 text-gray-500" />,
      count: getCategoryCount("uncategorized")
    }
  ];

  // Get custom categories from documents
  const getCustomCategories = () => {
    if (!documents) return [];
    
    const customCats = new Set<string>();
    documents.forEach(doc => {
      if (doc.category && 
          !["important", "lease", "receipt", ""].includes(doc.category) &&
          doc.category !== "") {
        customCats.add(doc.category);
      }
    });
    
    return Array.from(customCats).sort().map(cat => ({
      id: cat,
      name: cat,
      icon: <Folder className="h-4 w-4 text-purple-500" />,
      count: getCategoryCount(cat)
    }));
  };

  const customCategories = getCustomCategories();
  const allCategories = [...standardCategories, ...customCategories];

  return (
    <div className="w-full md:w-64 border rounded-lg p-2 mb-4 md:mb-0 md:mr-4 bg-background">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent rounded-md"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-5 w-5 text-blue-500" />
          <span className="font-medium">{t("categories")}</span>
        </div>
        <ChevronRight className={cn("h-4 w-4 transition-transform", expanded ? "rotate-90" : "")} />
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 space-y-1"
        >
          {allCategories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "flex items-center justify-between px-2 py-1.5 text-sm rounded-md cursor-pointer",
                selectedCategory === category.id
                  ? "bg-primary/10 font-medium"
                  : "hover:bg-accent"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <div className="flex items-center space-x-2">
                {category.icon}
                <span>{category.name}</span>
              </div>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

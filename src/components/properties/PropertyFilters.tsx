
import React from "react";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface PropertyFiltersProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  propertyTypes: readonly string[];
  compact?: boolean;
}

const PropertyFilters = ({
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  propertyTypes,
  compact = false,
}: PropertyFiltersProps) => {
  const { t } = useLocale();

  if (compact) {
    return (
      <div className="w-full relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchProperties')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border mb-8"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('filterByType')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {type === "All" ? t('filterByType') : t(type.toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('searchProperties')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary transition-all hover:border-primary/50 dark:hover:border-primary/50"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyFilters;

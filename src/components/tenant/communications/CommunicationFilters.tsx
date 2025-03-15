
import { SearchInput } from "./filters/SearchInput";
import { DateFilter } from "./filters/DateFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Calendar, Search, MessageSquare, AlertTriangle, Clock, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface CommunicationFiltersProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
}

export const CommunicationFilters = ({
  searchQuery,
  startDate,
  selectedType,
  communicationTypes,
  onSearchChange,
  onDateChange,
  onTypeChange,
}: CommunicationFiltersProps) => {
  const { t } = useLocale();
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  const handleTypeChange = (value: string) => {
    onTypeChange(value === "all" ? null : value);
    setFiltersApplied(value !== "all" || !!startDate || !!searchQuery);
  };
  
  const handleDateChange = (value: string) => {
    onDateChange(value);
    setFiltersApplied(!!value || !!selectedType || !!searchQuery);
  };
  
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setFiltersApplied(!!value || !!selectedType || !!startDate);
  };
  
  const clearFilters = () => {
    onSearchChange("");
    onDateChange("");
    onTypeChange(null);
    setFiltersApplied(false);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500 mr-2" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 bg-muted/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('searchMessages')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1 h-8 w-8 p-0 rounded-full" 
              onClick={() => handleSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <DateFilter 
            value={startDate} 
            onChange={handleDateChange} 
          />
        </div>
        
        <div className="flex-shrink-0 min-w-[200px]">
          <Select 
            value={selectedType || "all"} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="h-10 bg-background rounded-lg border-input">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={t('filter')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  {t('allMessages')}
                </div>
              </SelectItem>
              {communicationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    {getTypeIcon(type)}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filtersApplied && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="flex-shrink-0 h-10 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4 mr-2" />
            {t('clearFilter')}
          </Button>
        )}
      </div>
      
      {filtersApplied && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1 py-1.5 px-3 bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
              <Search className="h-3 w-3" />
              {searchQuery}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {startDate && (
            <Badge variant="secondary" className="flex items-center gap-1 py-1.5 px-3 bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
              <Calendar className="h-3 w-3" />
              {new Date(startDate).toLocaleDateString()}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleDateChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedType && (
            <Badge variant="secondary" className="flex items-center gap-1 py-1.5 px-3 bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              {getTypeIcon(selectedType)}
              {selectedType}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleTypeChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};

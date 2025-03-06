
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FilterBadgesProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  onClearSearch: () => void;
  onClearDate: () => void;
  onClearType: () => void;
  getTypeIcon: (type: string) => JSX.Element;
}

export const FilterBadges = ({
  searchQuery,
  startDate,
  selectedType,
  onClearSearch,
  onClearDate,
  onClearType,
  getTypeIcon
}: FilterBadgesProps) => {
  const { t } = useLocale();
  
  if (!searchQuery && !startDate && !selectedType) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Search className="h-3 w-3" />
          {searchQuery}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1" 
            onClick={onClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {startDate && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(startDate).toLocaleDateString()}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1" 
            onClick={onClearDate}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {selectedType && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {getTypeIcon(selectedType)}
          {selectedType}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1" 
            onClick={onClearType}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};

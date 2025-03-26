
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavedFilter } from "../hooks/useWorkOrderFilterState";
import { ListFilter, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SavedFiltersMenuProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filterId: string) => void;
  onDeleteFilter: (filterId: string) => void;
}

export const SavedFiltersMenu = ({
  savedFilters,
  onApplyFilter,
  onDeleteFilter
}: SavedFiltersMenuProps) => {
  const { t } = useLocale();

  if (savedFilters.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          {t('savedFilters')}
          <Badge variant="secondary">{savedFilters.length}</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {savedFilters.map((filter) => (
          <DropdownMenuItem
            key={filter.id}
            className="flex justify-between cursor-default"
          >
            <span 
              className="flex-1 cursor-pointer" 
              onClick={() => onApplyFilter(filter.id)}
            >
              {filter.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFilter(filter.id);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('delete')}</span>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

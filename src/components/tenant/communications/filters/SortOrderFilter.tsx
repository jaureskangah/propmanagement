
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SortOrderFilterProps {
  sortOrder: "newest" | "oldest";
  onSortOrderChange: (order: "newest" | "oldest") => void;
}

export const SortOrderFilter = ({ sortOrder, onSortOrderChange }: SortOrderFilterProps) => {
  const { t } = useLocale();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => onSortOrderChange(sortOrder === "newest" ? "oldest" : "newest")}
          >
            {sortOrder === "newest" ? (
              <ClockArrowDown className="h-4 w-4" />
            ) : (
              <ClockArrowUp className="h-4 w-4" />
            )}
            <span className="sr-only">
              {sortOrder === "newest" ? t("sortNewestFirst") : t("sortOldestFirst")}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {sortOrder === "newest" ? t("sortNewestFirst") : t("sortOldestFirst")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

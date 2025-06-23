
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TableShowMoreButtonProps {
  showAll: boolean;
  toggleShowAll: () => void;
  totalCount: number;
  initialDisplayCount: number;
}

export function TableShowMoreButton({ 
  showAll, 
  toggleShowAll, 
  totalCount, 
  initialDisplayCount 
}: TableShowMoreButtonProps) {
  const { t } = useLocale();
  
  if (totalCount <= initialDisplayCount) {
    return null;
  }

  const hiddenCount = totalCount - initialDisplayCount;

  return (
    <div className="flex justify-center pt-4 border-t">
      <Button
        variant="ghost"
        onClick={toggleShowAll}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAll ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            {t('showLess', { fallback: 'Voir moins' })}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            {t('showMore', { fallback: 'Voir plus' })} ({hiddenCount})
          </>
        )}
      </Button>
    </div>
  );
}

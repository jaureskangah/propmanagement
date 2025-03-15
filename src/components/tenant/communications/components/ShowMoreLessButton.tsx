
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ShowMoreLessButtonProps {
  showAll: boolean;
  toggleShowAll: () => void;
  totalCount: number;
  initialDisplayCount: number;
}

export const ShowMoreLessButton = ({
  showAll,
  toggleShowAll,
  totalCount,
  initialDisplayCount
}: ShowMoreLessButtonProps) => {
  const { t } = useLocale();

  if (totalCount <= initialDisplayCount) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleShowAll}
        className="flex items-center gap-2"
      >
        {showAll ? (
          <>
            <ChevronUp className="h-4 w-4" />
            {t('showLess')}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            {t('showMore')}
          </>
        )}
      </Button>
    </div>
  );
};

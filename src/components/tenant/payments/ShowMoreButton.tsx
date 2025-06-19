
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ShowMoreButtonProps {
  showAllPayments: boolean;
  onToggle: () => void;
  hiddenPaymentsCount: number;
}

export const ShowMoreButton = ({ 
  showAllPayments, 
  onToggle, 
  hiddenPaymentsCount 
}: ShowMoreButtonProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-center pt-4">
      <Button
        variant="outline"
        onClick={onToggle}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAllPayments ? (
          <>
            <ChevronUp className="h-4 w-4" />
            {t('payments.showLess')}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            {t('payments.showMorePayments').replace('{count}', hiddenPaymentsCount.toString())}
          </>
        )}
      </Button>
    </div>
  );
};

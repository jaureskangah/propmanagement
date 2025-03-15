
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

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

  // Ne pas afficher le bouton s'il n'y a rien de plus à montrer
  if (totalCount <= initialDisplayCount) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex justify-center mt-6"
    >
      <Button 
        variant="outline" 
        size="sm" 
        onClick={(e) => {
          e.stopPropagation();
          toggleShowAll();
        }}
        className="flex items-center gap-2 px-6 py-2 rounded-full shadow-sm bg-background hover:bg-accent/50 transition-all duration-200"
      >
        {showAll ? (
          <>
            <ChevronUp className="h-4 w-4" />
            {t('showLess')}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            {t('showMore')} ({totalCount - initialDisplayCount})
          </>
        )}
      </Button>
    </motion.div>
  );
};

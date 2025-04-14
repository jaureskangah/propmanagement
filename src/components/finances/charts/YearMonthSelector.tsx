
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface YearMonthSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
  view: 'monthly' | 'yearly';
}

export const YearMonthSelector = ({ 
  selectedYear, 
  onChange,
  view
}: YearMonthSelectorProps) => {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();
  
  // Limiter la sélection à 5 ans en arrière et 1 an en avant
  const minYear = currentYear - 5;
  const maxYear = currentYear + 1;
  
  const handlePreviousYear = () => {
    if (selectedYear > minYear) {
      onChange(selectedYear - 1);
    }
  };
  
  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      onChange(selectedYear + 1);
    }
  };
  
  return (
    <div className="flex items-center space-x-1 bg-muted/40 rounded-md p-1 border">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7"
        onClick={handlePreviousYear}
        disabled={selectedYear <= minYear}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{t('previousYear')}</span>
      </Button>
      
      <motion.div 
        key={selectedYear}
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-20 text-center text-sm font-medium"
      >
        {selectedYear}
      </motion.div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7"
        onClick={handleNextYear}
        disabled={selectedYear >= maxYear}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">{t('nextYear')}</span>
      </Button>
    </div>
  );
};


import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseDateSafe } from "@/lib/date";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  onClick?: () => void;
  isAmount?: boolean;
  isDate?: boolean;
}

export const InfoItem = ({ icon, label, value, highlight = false, onClick, isAmount = false, isDate = false }: InfoItemProps) => {
  const isMobile = useIsMobile();
  const { t, language } = useLocale();
  
  // Format amount with proper translation and spacing
  const formatValue = (val: string) => {
    if (isAmount && val.includes('$')) {
      // Extract the amount and add proper translation with space
      const amount = val.replace(/[^\d]/g, '');
      return `$${amount} ${t('perMonth')}`;
    }
    
    if (isDate) {
      try {
        const date = parseDateSafe(val);
        return format(date, "d MMMM yyyy", {
          locale: language === 'fr' ? fr : undefined
        });
      } catch (error) {
        return val;
      }
    }
    
    return val;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              `flex items-start gap-3 p-2 rounded-md transition-colors`,
              highlight ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : '',
              'hover:bg-secondary/50',
              onClick ? 'cursor-pointer' : ''
            )}
            onClick={onClick}
          >
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-sm font-medium truncate ${isMobile ? 'max-w-[250px]' : ''}`}>
                {formatValue(value)}
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formatValue(value)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

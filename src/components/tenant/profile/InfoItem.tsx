
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

export const InfoItem = ({ icon, label, value, highlight = false }: InfoItemProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            `flex items-start gap-3 p-2 rounded-md transition-colors`,
            highlight ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : '',
            'hover:bg-secondary/50'
          )}>
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-sm font-medium truncate ${isMobile ? 'max-w-[250px]' : ''}`}>{value}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

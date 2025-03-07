
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  date: string;
  details?: {
    [key: string]: string | number;
  };
}

export const ActivityItem = ({ 
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  description,
  date,
  details = {}
}: ActivityItemProps) => {
  const { language } = useLocale();
  
  // Format the date for display
  const dateObj = new Date(date);
  const formattedDate = format(dateObj, "PP", {
    locale: language === 'fr' ? fr : undefined
  });
  
  // Get relative time (e.g., "2 days ago")
  const timeAgo = formatDistanceToNow(dateObj, { 
    addSuffix: true,
    locale: language === 'fr' ? fr : undefined
  });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-muted/80 group cursor-pointer"
        >
          <div className={`rounded-full ${iconBgColor} p-2 shadow-md group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {timeAgo}
                </p>
              </TooltipTrigger>
              <TooltipContent side="left">
                {formattedDate}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-full ${iconBgColor} p-1.5`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <h4 className="text-sm font-semibold">{title}</h4>
          </div>
          <p className="text-sm">{description}</p>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">
              {formattedDate} ({timeAgo})
            </p>
            {Object.entries(details).length > 0 && (
              <div className="border-t pt-2 mt-2 space-y-1">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 text-xs">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

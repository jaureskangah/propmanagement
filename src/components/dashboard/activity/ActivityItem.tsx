
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
  date: string;
}

export const ActivityItem = ({ 
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  description,
  date 
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-muted/80 group dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50"
    >
      <div className={`rounded-full ${iconBgColor} p-2 shadow-md group-hover:scale-110 transition-transform duration-200 dark:bg-opacity-20`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium group-hover:text-primary transition-colors dark:text-white">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-gray-300">
          {description}
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-muted-foreground whitespace-nowrap dark:text-gray-400">
              {timeAgo}
            </p>
          </TooltipTrigger>
          <TooltipContent side="left" className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            {formattedDate}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

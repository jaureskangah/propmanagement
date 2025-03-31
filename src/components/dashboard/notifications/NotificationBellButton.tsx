
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocale } from "@/components/providers/LocaleProvider";

interface NotificationBellButtonProps {
  unreadCount: number;
}

export const NotificationBellButton = ({ unreadCount }: NotificationBellButtonProps) => {
  const { t } = useLocale();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -top-12 right-0 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-800",
              "border border-purple-100 hover:border-purple-200 dark:border-purple-900"
            )}
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-purple-600 text-[9px] font-medium text-white flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('notificationCenter')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationsSection } from "./notifications/NotificationsSection";
import { NotificationBellProps } from "./notifications/types";

export const NotificationBell = ({ 
  unreadCount, 
  unreadMessages = [], 
  maintenanceRequests = [],
  onShowAllNotifications
}: NotificationBellProps) => {
  const { t } = useLocale();
  
  // Don't show anything if there are no notifications
  if (unreadCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -top-12 right-0 h-12 w-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-800",
              "border border-purple-100 hover:border-purple-200 dark:border-purple-900"
            )}
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72" align="end">
          <div className="flex items-center justify-between px-3 py-2">
            <h4 className="font-medium text-sm">{t('notificationCenter')}</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={onShowAllNotifications}
            >
              {t('viewAll')}
            </Button>
          </div>
          
          <DropdownMenuGroup>
            <ScrollArea className="h-64">
              <NotificationsSection 
                unreadMessages={unreadMessages}
                maintenanceRequests={maintenanceRequests}
                t={t}
              />
            </ScrollArea>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { NotificationMessage, NotificationRequest } from "./types";
import { NotificationBellButton } from "./NotificationBellButton";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationsSection } from "./NotificationsSection";
import { useLocale } from "@/components/providers/LocaleProvider";

interface NotificationDropdownProps {
  unreadCount: number;
  unreadMessages: NotificationMessage[];
  maintenanceRequests: NotificationRequest[];
  onShowAllNotifications: () => void;
}

export const NotificationDropdown = ({
  unreadCount,
  unreadMessages = [],
  maintenanceRequests = [],
  onShowAllNotifications
}: NotificationDropdownProps) => {
  const { t } = useLocale();
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <NotificationBellButton unreadCount={unreadCount} />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72" align="end">
          <NotificationHeader onViewAll={onShowAllNotifications} />
          
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

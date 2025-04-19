import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { NotificationRequest } from "./types";
import { NotificationBellButton } from "./NotificationBellButton";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationsSection } from "./NotificationsSection";
import { useLocale } from "@/components/providers/LocaleProvider";

interface NotificationDropdownProps {
  unreadCount: number;
  maintenanceRequests: NotificationRequest[];
}

export const NotificationDropdown = ({
  unreadCount,
  maintenanceRequests = []
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
          <div>
            <NotificationBellButton unreadCount={unreadCount} />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72" align="end">
          <NotificationHeader />
          
          <DropdownMenuGroup>
            <ScrollArea className="h-64">
              <NotificationsSection 
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

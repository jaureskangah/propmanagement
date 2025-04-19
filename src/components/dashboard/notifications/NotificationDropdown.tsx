
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
import { useEffect, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  
  // Fermer le dropdown lorsque l'utilisateur clique ailleurs
  useEffect(() => {
    const handleOutsideClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    // Ajout d'un délai pour éviter que le gestionnaire soit appelé immédiatement
    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative z-50"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild onClick={(e) => {
          e.stopPropagation(); // Empêcher la propagation de l'événement
          setIsOpen(!isOpen);
        }}>
          <div>
            <NotificationBellButton unreadCount={unreadCount} />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-72" 
          align="end"
          onClick={(e) => e.stopPropagation()} // Empêcher la fermeture lors d'un clic dans le contenu
        >
          <NotificationHeader onViewAll={() => {
            setIsOpen(false);
            onShowAllNotifications();
          }} />
          
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

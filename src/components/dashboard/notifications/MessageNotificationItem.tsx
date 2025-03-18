
import { MessageSquare } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { NotificationMessage } from "./types";

interface MessageNotificationItemProps {
  message: NotificationMessage;
  t: (key: string) => string;
}

export const MessageNotificationItem = ({ message, t }: MessageNotificationItemProps) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/tenants?selected=${message.tenants?.id}&tab=communications`);
  };

  return (
    <DropdownMenuItem 
      key={message.id} 
      className="cursor-pointer"
      onClick={handleMessageClick}
    >
      <div className="flex flex-col w-full text-left px-3 py-2">
        <span className="font-medium text-xs">
          {message.tenants?.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {message.tenants?.properties?.name && `${message.tenants.properties.name}, `}
          {t("unit")} {message.tenants?.unit_number}
        </span>
        <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
          {message.subject}
        </span>
      </div>
    </DropdownMenuItem>
  );
};

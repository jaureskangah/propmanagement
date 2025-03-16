
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface UnreadMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadMessages: any[];
}

export const UnreadMessagesDialog = ({
  open,
  onOpenChange,
  unreadMessages,
}: UnreadMessagesDialogProps) => {
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : enUS;

  // Only show messages from tenants with explicit check for true
  const tenantMessages = unreadMessages.filter(message => {
    console.log("Filtering message:", message);
    return message.is_from_tenant === true && message.status === "unread";
  });

  console.log("Final filtered tenant messages:", tenantMessages);

  const handleViewMessages = (tenantId?: string) => {
    onOpenChange(false);
    if (tenantId) {
      console.log("Navigating to tenant communications:", tenantId);
      navigate(`/tenants?selected=${tenantId}&tab=communications`);
    } else if (tenantMessages.length > 0 && tenantMessages[0].tenant_id) {
      console.log("Navigating to tenant communications:", tenantMessages[0].tenant_id);
      navigate(`/tenants?selected=${tenantMessages[0].tenant_id}&tab=communications`);
    } else {
      navigate("/tenants");
    }
  };

  // Don't show dialog if there are no messages from tenants
  if (tenantMessages.length === 0) {
    console.log("No tenant messages to display, hiding dialog");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("newMessages")}</DialogTitle>
          <DialogDescription>
            {t("youHaveUnreadMessages", { 
              count: String(tenantMessages.length) 
            })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <ul className="space-y-3 my-4">
            {tenantMessages.map((message) => (
              <li 
                key={message.id} 
                className="p-3 bg-muted/40 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => handleViewMessages(message.tenant_id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">
                    {message.tenants?.name || t('tenant')}
                    {message.tenants?.unit_number && ` (${t("unit")} ${message.tenants.unit_number})`}
                  </span>
                  {message.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(new Date(message.created_at), new Date(), { 
                        addSuffix: true,
                        locale 
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium">{message.subject}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {message.category || t('general')}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    {t('unread')}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <DialogFooter className="sm:justify-between flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          <Button onClick={() => handleViewMessages()}>
            {t("viewAllMessages")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

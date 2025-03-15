
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
  const { t } = useLocale();

  // Only show messages from tenants with explicit check for true
  const tenantMessages = unreadMessages.filter(message => {
    console.log("Filtering message:", message);
    console.log("is_from_tenant value:", message.is_from_tenant);
    return message.is_from_tenant === true && message.status === "unread";
  });

  console.log("Final filtered tenant messages:", tenantMessages);

  const handleViewMessages = () => {
    onOpenChange(false);
    if (tenantMessages.length > 0 && tenantMessages[0].tenants?.id) {
      console.log("Navigating to tenant communications:", tenantMessages[0].tenants.id);
      navigate(`/tenants?selected=${tenantMessages[0].tenants.id}&tab=communications`);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('newMessages')}</DialogTitle>
          <DialogDescription>
            {t('youHaveUnreadMessages', { 
              count: String(tenantMessages.length) 
            })}
            <ul className="mt-2 space-y-2">
              {tenantMessages.map((message) => (
                <li key={message.id} className="text-sm">
                  <span className="font-semibold">
                    {message.tenants?.name} ({t('unit')} {message.tenants?.unit_number}):
                  </span>{' '}
                  {message.subject}
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
          <Button onClick={handleViewMessages}>
            {t('viewMessages')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

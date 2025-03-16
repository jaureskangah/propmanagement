
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
import { useState, useEffect } from "react";

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
  const [localOpen, setLocalOpen] = useState(open);

  // Sync local state with prop
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Filter to show only messages from tenants
  const tenantMessages = unreadMessages.filter(message => {
    return message.is_from_tenant === true && message.status === "unread";
  });

  console.log("Filtered tenant messages for dialog:", tenantMessages);

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
    <Dialog open={localOpen} onOpenChange={(value) => {
      setLocalOpen(value);
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("newMessages")}</DialogTitle>
          <DialogDescription>
            {t("youHaveUnreadMessages", { 
              count: String(tenantMessages.length) 
            })}
            <ul className="mt-2 space-y-2">
              {tenantMessages.map((message) => (
                <li key={message.id} className="text-sm p-2 rounded bg-muted/50">
                  <span className="font-semibold">
                    {message.tenants?.name} ({t("unit")} {message.tenants?.unit_number}):
                  </span>{' '}
                  {message.subject}
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          <Button onClick={handleViewMessages} className="bg-purple-600 hover:bg-purple-700">
            {t("viewMessages")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

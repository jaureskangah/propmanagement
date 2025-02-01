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

  // Only show messages from tenants
  const tenantMessages = unreadMessages.filter(message => {
    console.log("Checking message:", message);
    console.log("is_from_tenant value:", message.is_from_tenant);
    return message.is_from_tenant === true;
  });

  console.log("Filtered tenant messages:", tenantMessages);

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
          <DialogTitle>New Messages</DialogTitle>
          <DialogDescription>
            You have {tenantMessages.length} new unread message
            {tenantMessages.length > 1 ? 's' : ''} from your tenants:
            <ul className="mt-2 space-y-2">
              {tenantMessages.map((message) => (
                <li key={message.id} className="text-sm">
                  <span className="font-semibold">
                    {message.tenants?.name} (Unit {message.tenants?.unit_number}):
                  </span>{' '}
                  {message.subject}
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleViewMessages}>
            View Messages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
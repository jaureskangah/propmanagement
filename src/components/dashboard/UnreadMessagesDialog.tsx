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
          <DialogTitle>Nouveaux Messages</DialogTitle>
          <DialogDescription>
            Vous avez {tenantMessages.length} nouveau{tenantMessages.length > 1 ? 'x' : ''} message{tenantMessages.length > 1 ? 's' : ''} non lu{tenantMessages.length > 1 ? 's' : ''} de vos locataires :
            <ul className="mt-2 space-y-2">
              {tenantMessages.map((message) => (
                <li key={message.id} className="text-sm">
                  <span className="font-semibold">
                    {message.tenants?.name} (Unité {message.tenants?.unit_number}):
                  </span>{' '}
                  {message.subject}
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={handleViewMessages}>
            Voir les Messages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
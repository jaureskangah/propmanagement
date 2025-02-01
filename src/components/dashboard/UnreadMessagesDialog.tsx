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

  const handleViewMessages = () => {
    onOpenChange(false);
    if (unreadMessages.length > 0 && unreadMessages[0].tenants?.id) {
      console.log("Navigating to tenant communications:", unreadMessages[0].tenants.id);
      navigate(`/tenants?selected=${unreadMessages[0].tenants.id}&tab=communications`);
    } else {
      navigate("/tenants");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Messages</DialogTitle>
          <DialogDescription>
            You have {unreadMessages.length} new unread message
            {unreadMessages.length > 1 ? 's' : ''} from your tenants:
            <ul className="mt-2 space-y-2">
              {unreadMessages.map((message) => (
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
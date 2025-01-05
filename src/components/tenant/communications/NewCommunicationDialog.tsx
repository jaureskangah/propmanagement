import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NewCommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newCommData: {
    type: string;
    subject: string;
    content: string;
    category: string;
  };
  onDataChange: (data: any) => void;
  onSubmit: () => void;
}

export const NewCommunicationDialog = ({
  isOpen,
  onClose,
  newCommData,
  onDataChange,
  onSubmit,
}: NewCommunicationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Communication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Select
            value={newCommData.type}
            onValueChange={(value) => onDataChange({ ...newCommData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Communication type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="notification">Notification</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={newCommData.category}
            onValueChange={(value) => onDataChange({ ...newCommData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Subject"
            value={newCommData.subject}
            onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
          />
          <Textarea
            placeholder="Content"
            value={newCommData.content}
            onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
            rows={4}
          />
          <Button onClick={onSubmit} className="w-full">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
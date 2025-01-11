import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  console.log("Current newCommData:", newCommData);

  const handleTypeChange = (value: string) => {
    console.log("Selected type:", value);
    onDataChange({ ...newCommData, type: value });
  };

  const handleCategoryChange = (value: string) => {
    console.log("Selected category:", value);
    onDataChange({ ...newCommData, category: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Communication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={newCommData.type || "email"} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={newCommData.category || "general"} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={newCommData.subject}
              onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
              placeholder="Enter subject"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={newCommData.content}
              onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
              placeholder="Enter message content"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
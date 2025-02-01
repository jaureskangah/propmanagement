import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  console.log("Current newCommData:", newCommData);

  const handleCategoryChange = (value: string) => {
    console.log("Selected category:", value);
    onDataChange({ ...newCommData, category: value });
  };

  const handleSubmit = () => {
    if (!newCommData.subject.trim()) {
      toast({
        title: "Error",
        description: "Subject is required",
        variant: "destructive",
      });
      return;
    }

    if (!newCommData.content.trim()) {
      toast({
        title: "Error",
        description: "Message content is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={newCommData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject<span className="text-red-500">*</span></Label>
            <Input
              value={newCommData.subject}
              onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
              placeholder="Enter subject"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content<span className="text-red-500">*</span></Label>
            <Textarea
              value={newCommData.content}
              onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
              placeholder="Enter message content"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={newCommData.type || "email"} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sujet</Label>
            <Input
              value={newCommData.subject}
              onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
              placeholder="Entrez le sujet"
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <Textarea
              value={newCommData.content}
              onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
              placeholder="Entrez votre message"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSubmit}>
            Envoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
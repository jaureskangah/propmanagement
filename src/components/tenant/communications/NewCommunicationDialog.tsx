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
        title: "Erreur",
        description: "Le sujet est requis",
        variant: "destructive",
      });
      return;
    }

    if (!newCommData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le contenu du message est requis",
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
          <DialogTitle>Nouveau Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select 
              value={newCommData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="payment">Paiement</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sujet<span className="text-red-500">*</span></Label>
            <Input
              value={newCommData.subject}
              onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
              placeholder="Entrer le sujet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu<span className="text-red-500">*</span></Label>
            <Textarea
              value={newCommData.content}
              onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
              placeholder="Entrer le contenu du message"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Envoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/PropertyForm";
import { useProperties, PropertyFormData } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { addProperty } = useProperties();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await addProperty(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
        </DialogHeader>
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  );
}
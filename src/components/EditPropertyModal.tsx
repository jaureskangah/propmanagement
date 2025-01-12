import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/PropertyForm";
import { useProperties, Property, PropertyFormData } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function EditPropertyModal({ isOpen, onClose, property }: EditPropertyModalProps) {
  const { updateProperty } = useProperties();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await updateProperty({ id: property.id, data });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
    }
  };

  const initialData: PropertyFormData = {
    name: property.name,
    address: property.address,
    units: property.units,
    type: property.type,
    image: property.image_url,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={false}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
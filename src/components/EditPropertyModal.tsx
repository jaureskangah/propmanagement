import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyForm } from "@/components/PropertyForm";
import { Property, PropertyFormData, useProperties } from "@/hooks/useProperties";

interface EditPropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPropertyModal({ property, isOpen, onClose }: EditPropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProperty } = useProperties();

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      const success = await updateProperty(property.id, data);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
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
          isSubmitting={isSubmitting}
          initialData={{
            name: property.name,
            address: property.address,
            units: property.units,
            type: property.type,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
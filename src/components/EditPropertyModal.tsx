
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyEnhancedForm } from "@/components/properties/PropertyEnhancedForm";
import { useProperties, Property, PropertyFormData } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function EditPropertyModal({ isOpen, onClose, property }: EditPropertyModalProps) {
  const { updateProperty } = useProperties();
  const { t } = useLocale();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await updateProperty({ id: property.id, data });
      onClose();
      toast({
        title: t('success'),
        description: t('propertyUpdated'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorUpdatingProperty'),
        variant: "destructive",
      });
    }
  };

  const initialData: PropertyFormData = {
    name: property.name,
    address: property.address,
    city: property.city || "",
    province: property.province || "ON",
    postal_code: property.postal_code || "",
    units: property.units,
    type: property.type,
    rent_amount: property.rent_amount,
    image: property.image_url,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{t('editProperty')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <PropertyEnhancedForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={false}
            initialData={initialData}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

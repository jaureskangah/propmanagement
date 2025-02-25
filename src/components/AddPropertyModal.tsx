
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/PropertyForm";
import { useProperties, PropertyFormData } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { addProperty } = useProperties();
  const { t } = useLocale();

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await addProperty(data);
      onClose();
      toast({
        title: t('success'),
        description: t('propertyAdded'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorAddingProperty'),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addProperty')}</DialogTitle>
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

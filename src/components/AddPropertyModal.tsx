
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyEnhancedForm } from "@/components/properties/PropertyEnhancedForm";
import { useProperties, PropertyFormData } from "@/hooks/useProperties";
import { toast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('addProperty')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
          <PropertyEnhancedForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={false}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

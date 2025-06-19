
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "./PaymentForm";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  onPaymentAdded: () => void;
}

export const AddPaymentDialog = ({
  open,
  onOpenChange,
  tenantId,
  onPaymentAdded,
}: AddPaymentDialogProps) => {
  const { t } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('payments.addPayment')}</DialogTitle>
        </DialogHeader>

        <PaymentForm 
          tenantId={tenantId}
          onSuccess={onPaymentAdded}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

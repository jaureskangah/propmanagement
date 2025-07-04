
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TenantPayment } from "@/types/tenant";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DeletePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: TenantPayment;
  onPaymentDeleted: () => void;
}

export const DeletePaymentDialog = ({
  open,
  onOpenChange,
  payment,
  onPaymentDeleted,
}: DeletePaymentDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLocale();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tenant_payments")
        .delete()
        .eq("id", payment.id);

      if (error) throw error;

      toast({
        title: t('paymentDeleted'),
        description: t('paymentDeletedSuccess'),
      });
      
      onPaymentDeleted();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: t('error'),
        description: t('paymentError'),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmDeletePayment')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('paymentDeleteWarning')} ${payment.amount} {t('from')} {" "}
            {format(new Date(payment.payment_date), "MMMM dd, yyyy", { 
              locale: language === 'fr' ? fr : enUS 
            })}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

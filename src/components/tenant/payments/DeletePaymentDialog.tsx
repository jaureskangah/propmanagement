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
import { enUS } from "date-fns/locale";

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tenant_payments")
        .delete()
        .eq("id", payment.id);

      if (error) throw error;

      toast({
        title: "Payment Deleted",
        description: "The payment has been deleted successfully.",
      });
      
      onPaymentDeleted();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the payment.",
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
          <AlertDialogTitle>Are you sure you want to delete this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete the payment of ${payment.amount} from{" "}
            {format(new Date(payment.payment_date), "MMMM dd, yyyy", { locale: enUS })}.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
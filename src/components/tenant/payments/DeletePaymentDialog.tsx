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
import { fr } from "date-fns/locale";

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
        title: "Paiement supprimé",
        description: "Le paiement a été supprimé avec succès.",
      });
      
      onPaymentDeleted();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du paiement.",
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
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce paiement ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer le paiement de {payment.amount}€ du{" "}
            {format(new Date(payment.payment_date), "dd MMMM yyyy", { locale: fr })}.
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
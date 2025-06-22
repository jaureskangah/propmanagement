
import React from "react";
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
import { useSupabaseDelete } from "@/hooks/supabase/useSupabaseDelete";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface DeleteExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    id: string;
    category: string;
    amount: number;
    date: string;
    description?: string;
  } | null;
  propertyId: string;
}

export const DeleteExpenseDialog = ({
  isOpen,
  onClose,
  expense,
  propertyId,
}: DeleteExpenseDialogProps) => {
  const deleteExpense = useSupabaseDelete("maintenance_expenses", {
    successMessage: "Dépense supprimée avec succès",
    queryKeysToInvalidate: [
      ["maintenance_expenses", propertyId],
      ["financial_data", propertyId],
    ],
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    if (expense) {
      deleteExpense.mutate(expense.id);
    }
  };

  if (!expense) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la dépense</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p className="text-base">
              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
            </p>
            <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
              <div><strong>Catégorie:</strong> {expense.category}</div>
              <div><strong>Montant:</strong> {formatCurrency(expense.amount)}</div>
              <div><strong>Date:</strong> {format(parseISO(expense.date), 'dd MMMM yyyy', { locale: fr })}</div>
              {expense.description && (
                <div><strong>Description:</strong> {expense.description}</div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={deleteExpense.isPending}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteExpense.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

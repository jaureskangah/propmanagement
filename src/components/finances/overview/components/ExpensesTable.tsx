
import { useState } from "react";
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TableShowMoreButton } from "./TableShowMoreButton";
import { useSupabaseDelete } from "@/hooks/supabase/useSupabaseDelete";

interface ExpensesTableProps {
  expenses: any[];
  isLoading: boolean;
  propertyId?: string;
}

export function ExpensesTable({ expenses, isLoading, propertyId }: ExpensesTableProps) {
  const { t } = useLocale();
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 5;

  // Hook pour supprimer les dépenses de maintenance
  const deleteMaintenanceExpense = useSupabaseDelete("maintenance_expenses", {
    successMessage: "Dépense supprimée avec succès",
    queryKeysToInvalidate: [
      ["financial_expenses", propertyId],
      ["maintenance_expenses", propertyId],
    ],
  });

  // Hook pour supprimer les interventions de fournisseurs
  const deleteVendorIntervention = useSupabaseDelete("vendor_interventions", {
    successMessage: "Intervention supprimée avec succès",
    queryKeysToInvalidate: [
      ["financial_expenses", propertyId],
      ["vendor_interventions", propertyId],
    ],
  });

  const handleDelete = (expense: any) => {
    if (expense.type === 'maintenance') {
      deleteMaintenanceExpense.mutate(expense.id);
    } else if (expense.type === 'intervention') {
      deleteVendorIntervention.mutate(expense.id);
    }
  };

  // Log to debug the expenses data
  console.log("ExpensesTable received data:", expenses);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs">
        {t('noExpenseData')}
      </div>
    );
  }

  const displayedExpenses = showAll ? expenses : expenses.slice(0, initialDisplayCount);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">{t('date')}</TableHead>
            <TableHead className="text-xs">{t('category')}</TableHead>
            <TableHead className="text-xs">{t('description')}</TableHead>
            <TableHead className="text-xs text-right">{t('amount')}</TableHead>
            {propertyId && <TableHead className="text-xs text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedExpenses.map((expense, index) => {
            // Calculate the amount value, handling both 'amount' and 'cost' fields
            const amountValue = expense.amount !== undefined ? expense.amount : expense.cost;
            
            return (
              <TableRow key={expense.id || index} className="text-xs">
                <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{expense.category || expense.title}</TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell className="text-right">{formatCurrency(amountValue)}</TableCell>
                {propertyId && (
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense)}
                      disabled={deleteMaintenanceExpense.isPending || deleteVendorIntervention.isPending}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <TableShowMoreButton
        showAll={showAll}
        toggleShowAll={() => setShowAll(!showAll)}
        totalCount={expenses.length}
        initialDisplayCount={initialDisplayCount}
      />
    </div>
  );
}

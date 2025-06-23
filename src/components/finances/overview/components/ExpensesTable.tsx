
import { useState } from "react";
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TableShowMoreButton } from "./TableShowMoreButton";

interface ExpensesTableProps {
  expenses: any[];
  isLoading: boolean;
}

export function ExpensesTable({ expenses, isLoading }: ExpensesTableProps) {
  const { t } = useLocale();
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 5;

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

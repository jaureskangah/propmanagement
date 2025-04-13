
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ExpensesTableProps {
  expenses: any[];
  isLoading: boolean;
}

export function ExpensesTable({ expenses, isLoading }: ExpensesTableProps) {
  const { t } = useLocale();

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

  return (
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
        {expenses.map(expense => (
          <TableRow key={expense.id} className="text-xs">
            <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.description || '-'}</TableCell>
            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

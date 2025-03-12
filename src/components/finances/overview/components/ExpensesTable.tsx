
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface ExpensesTableProps {
  expenses: any[];
  isLoading: boolean;
}

export function ExpensesTable({ expenses, isLoading }: ExpensesTableProps) {
  const { t } = useLocale();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
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
          <TableHead className="text-xs">{t('amount')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map(expense => (
          <TableRow key={expense.id} className="text-xs">
            <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.description || '-'}</TableCell>
            <TableCell>${expense.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

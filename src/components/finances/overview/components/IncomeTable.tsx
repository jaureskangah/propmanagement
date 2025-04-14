
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface IncomeTableProps {
  payments: any[];
  tenants: any[];
  isLoading: boolean;
}

export function IncomeTable({ payments, tenants, isLoading }: IncomeTableProps) {
  const { t } = useLocale();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs">
        {t('noIncomeData')}
      </div>
    );
  }

  // Fonction pour traduire les statuts de paiement
  const getTranslatedStatus = (status: string) => {
    switch(status.toLowerCase()) {
      case "paid":
        return t('tenant.payments.paid');
      case "overdue":
        return t('tenant.payments.overdue');
      case "pending":
        return t('tenant.payments.pending');
      case "late":
        return t('tenant.payments.overdue');
      default:
        return status;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">{t('date')}</TableHead>
          <TableHead className="text-xs">{t('tenant')}</TableHead>
          <TableHead className="text-xs">{t('unitNumber')}</TableHead>
          <TableHead className="text-xs text-right">{t('amount')}</TableHead>
          <TableHead className="text-xs">{t('status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map(payment => {
          const tenant = tenants?.find(t => t.id === payment.tenant_id);
          return (
            <TableRow key={payment.id} className="text-xs">
              <TableCell>{format(new Date(payment.payment_date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{tenant?.name || '-'}</TableCell>
              <TableCell>{tenant?.unit_number || '-'}</TableCell>
              <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                  payment.status === 'late' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getTranslatedStatus(payment.status)}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

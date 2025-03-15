
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Payment {
  amount: number;
  status: string;
  payment_date: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  const { t, language } = useLocale();
  
  return (
    <div className="rounded-md border dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="dark:bg-gray-800/50">
            <TableHead className="dark:text-gray-300">{t('date', { fallback: 'Date' })}</TableHead>
            <TableHead className="dark:text-gray-300">{t('amount', { fallback: 'Amount' })}</TableHead>
            <TableHead className="dark:text-gray-300">{t('status', { fallback: 'Status' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index} className="dark:border-gray-700 dark:hover:bg-gray-800/30">
              <TableCell className="dark:text-gray-300">
                {formatDate(payment.payment_date, language)}
              </TableCell>
              <TableCell className="dark:text-gray-300">${payment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : payment.status === 'late'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}
                >
                  {payment.status === 'paid' ? t('paid') : 
                   payment.status === 'late' ? t('late', { fallback: 'Late' }) : 
                   t('pending')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

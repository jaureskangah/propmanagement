
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon, DollarSign, Hash, Wallet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface ExpensesTableProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
    description?: string;
  }[];
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : enUS;
  
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('expenses', { fallback: 'Expenses' })}</CardTitle>
          <CardDescription>{t('propertyExpenses', { fallback: 'Property expenses' })}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          {t('noExpenseData', { fallback: 'No expense data available for this property' })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenses', { fallback: 'Expenses' })}</CardTitle>
        <CardDescription>{t('propertyExpenses', { fallback: 'Property expenses' })}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('category', { fallback: 'Category' })}</TableHead>
              <TableHead>{t('amount', { fallback: 'Amount' })}</TableHead>
              <TableHead>{t('date', { fallback: 'Date' })}</TableHead>
              <TableHead className="hidden md:table-cell">{t('description', { fallback: 'Description' })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span>{expense.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">${expense.amount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                    {format(parseISO(expense.date), 'PPP', { locale })}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {expense.description || 
                    <span className="text-muted-foreground italic">
                      {t('noDescription', { fallback: 'No description' })}
                    </span>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

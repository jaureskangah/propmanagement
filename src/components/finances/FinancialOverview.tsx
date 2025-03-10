
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface FinancialOverviewProps {
  propertyId: string | null;
}

export default function FinancialOverview({ propertyId }: FinancialOverviewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['financial_tenants', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, unit_number, rent_amount')
        .eq('property_id', propertyId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['financial_payments', propertyId],
    queryFn: async () => {
      if (!propertyId || !tenants?.length) return [];
      
      const tenantIds = tenants.map(t => t.id);
      
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('id, amount, payment_date, status, tenant_id')
        .in('tenant_id', tenantIds)
        .order('payment_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId && !!tenants?.length
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['financial_expenses', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from('maintenance_expenses')
        .select('id, amount, date, category, description')
        .eq('property_id', propertyId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId
  });

  const isLoading = tenantsLoading || paymentsLoading || expensesLoading;

  const handleExportData = () => {
    if (!propertyId) return;

    const workbook = XLSX.utils.book_new();
    
    // Add income sheet
    if (payments && payments.length > 0) {
      const incomeData = payments.map(payment => {
        const tenant = tenants?.find(t => t.id === payment.tenant_id);
        return {
          [t('date')]: format(new Date(payment.payment_date), 'yyyy-MM-dd'),
          [t('tenant')]: tenant?.name || '',
          [t('unitNumber')]: tenant?.unit_number || '',
          [t('amount')]: payment.amount,
          [t('status')]: payment.status
        };
      });
      
      const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
      XLSX.utils.book_append_sheet(workbook, incomeSheet, t('income'));
    }
    
    // Add expenses sheet
    if (expenses && expenses.length > 0) {
      const expensesData = expenses.map(expense => {
        return {
          [t('date')]: format(new Date(expense.date), 'yyyy-MM-dd'),
          [t('category')]: expense.category,
          [t('description')]: expense.description || '',
          [t('amount')]: expense.amount
        };
      });
      
      const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(workbook, expensesSheet, t('expenses'));
    }
    
    // Save workbook
    XLSX.writeFile(workbook, `property_financials_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const renderIncomeTable = () => {
    if (paymentsLoading) {
      return (
        <div className="flex justify-center items-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!payments || payments.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {t('noIncomeData')}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('tenant')}</TableHead>
            <TableHead>{t('unitNumber')}</TableHead>
            <TableHead>{t('amount')}</TableHead>
            <TableHead>{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(payment => {
            const tenant = tenants?.find(t => t.id === payment.tenant_id);
            return (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.payment_date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{tenant?.name || '-'}</TableCell>
                <TableCell>{tenant?.unit_number || '-'}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'late' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  const renderExpensesTable = () => {
    if (expensesLoading) {
      return (
        <div className="flex justify-center items-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!expenses || expenses.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {t('noExpenseData')}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('category')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead>{t('amount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description || '-'}</TableCell>
              <TableCell>${expense.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (!propertyId) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('selectPropertyToViewFinancialData')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t('financialOverview')}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">{t('exportToExcel')}</span>
            <span className="sm:hidden">{t('export')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="income" 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'income' | 'expenses')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="income">{t('income')}</TabsTrigger>
            <TabsTrigger value="expenses">{t('expenses')}</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="overflow-x-auto">
            {renderIncomeTable()}
          </TabsContent>
          <TabsContent value="expenses" className="overflow-x-auto">
            {renderExpensesTable()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

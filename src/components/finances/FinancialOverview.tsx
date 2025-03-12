
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns"; 
import { useFinancialOverviewData } from "./overview/hooks/useFinancialOverviewData";
import { IncomeTable } from "./overview/components/IncomeTable";
import { ExpensesTable } from "./overview/components/ExpensesTable";

interface FinancialOverviewProps {
  propertyId: string | null;
}

export default function FinancialOverview({ propertyId }: FinancialOverviewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const { tenants, payments, expenses, isLoading } = useFinancialOverviewData(propertyId);

  const handleExportData = () => {
    if (!propertyId) return;

    const workbook = XLSX.utils.book_new();
    
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
    
    if (expenses && expenses.length > 0) {
      const expensesData = expenses.map(expense => ({
        [t('date')]: format(new Date(expense.date), 'yyyy-MM-dd'),
        [t('category')]: expense.category,
        [t('description')]: expense.description || '',
        [t('amount')]: expense.amount
      }));
      
      const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(workbook, expensesSheet, t('expenses'));
    }
    
    XLSX.writeFile(workbook, `property_financials_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (!propertyId) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-4 text-center text-muted-foreground text-sm">
          {t('selectPropertyToViewFinancialData')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t('financialOverview')}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={isLoading}
            className="flex items-center gap-1 h-8 text-xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
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
          <TabsList className="grid w-full grid-cols-2 mb-3 h-8">
            <TabsTrigger value="income" className="text-xs h-7">{t('income')}</TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs h-7">{t('expenses')}</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="overflow-x-auto">
            <IncomeTable 
              payments={payments || []} 
              tenants={tenants || []} 
              isLoading={isLoading} 
            />
          </TabsContent>
          <TabsContent value="expenses" className="overflow-x-auto">
            <ExpensesTable 
              expenses={expenses || []} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

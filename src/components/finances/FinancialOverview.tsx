
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFinancialOverviewData } from "./overview/hooks/useFinancialOverviewData";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { IncomeTable } from "./overview/components/IncomeTable";
import { ExpensesTable } from "./overview/components/ExpensesTable";

interface FinancialOverviewProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialOverview = ({ propertyId, selectedYear }: FinancialOverviewProps) => {
  const { t } = useLocale();
  const { tenants, payments, expenses, isLoading } = useFinancialOverviewData(propertyId, selectedYear);

  if (isLoading) {
    return <LoadingMetrics />;
  }

  if (!propertyId) {
    return <NoPropertySelected type="financial-overview" />;
  }

  if (!payments || !expenses) {
    return <NoPropertySelected type="financial-overview" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {t('financialOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income">
          <TabsList className="mb-4">
            <TabsTrigger value="income">{t('income')}</TabsTrigger>
            <TabsTrigger value="expenses">{t('expenses')}</TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <IncomeTable payments={payments} tenants={tenants} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesTable expenses={expenses} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;

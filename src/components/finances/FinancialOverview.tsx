
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFinancialOverviewData } from "./overview/hooks/useFinancialOverviewData";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "./metrics/ErrorState";
import { IncomeTable } from "./overview/components/IncomeTable";
import { ExpensesTable } from "./overview/components/ExpensesTable";

interface FinancialOverviewProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialOverview = ({ propertyId, selectedYear }: FinancialOverviewProps) => {
  const { t, language } = useLocale();
  const { tenants, payments, expenses, isLoading, error, refetch } = useFinancialOverviewData(propertyId, selectedYear);

  // Log for debugging
  useEffect(() => {
    console.log("FinancialOverview rendering with:", {
      propertyId,
      selectedYear,
      isLoading,
      expenses: expenses?.length || 0,
    });
  }, [propertyId, selectedYear, isLoading, expenses]);

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingMetrics />;
  }

  if (error) {
    console.error("Error loading financial overview:", error);
    return <ErrorState error={error as Error} onRetry={handleRetry} type="financial-overview" />;
  }

  if (!propertyId) {
    return <NoPropertySelected type="financial-overview" />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="income">
          <TabsList className="mb-4">
            <TabsTrigger value="income">{language === 'fr' ? "Revenus" : t('income')}</TabsTrigger>
            <TabsTrigger value="expenses">{language === 'fr' ? "Dépenses" : t('expenses')}</TabsTrigger>
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

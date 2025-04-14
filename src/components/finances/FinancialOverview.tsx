
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFinancialOverviewData } from "./overview/hooks/useFinancialOverviewData";
import { LoadingMetrics } from "./metrics/LoadingMetrics";
import { NoPropertySelected } from "./metrics/NoPropertySelected";
import { ErrorState } from "@/components/ui/error-state";
import { IncomeTable } from "./overview/components/IncomeTable";
import { ExpensesTable } from "./overview/components/ExpensesTable";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface FinancialOverviewProps {
  propertyId: string | null;
  selectedYear: number;
}

const FinancialOverview = ({ propertyId, selectedYear }: FinancialOverviewProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
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
    toast({
      title: t('refreshing'),
      description: t('attemptingToRefreshData')
    });
    refetch();
  };

  if (isLoading) {
    return <LoadingMetrics />;
  }

  if (error) {
    console.error("Error loading financial overview:", error);
    return (
      <ErrorState 
        title={t('errorLoadingOverview')}
        error={error as Error}
        onRetry={handleRetry}
      />
    );
  }

  if (!propertyId) {
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

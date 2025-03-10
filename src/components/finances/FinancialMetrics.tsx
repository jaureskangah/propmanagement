
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DollarSign, Wallet, TrendingUp, Landmark } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialMetricsProps {
  propertyId: string | null;
}

export default function FinancialMetrics({ propertyId }: FinancialMetricsProps) {
  const { t } = useLocale();

  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financial_metrics', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      // Fetch payments for this property (via tenants)
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // If no tenants, return default data
      if (tenantIds.length === 0) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          roi: 0
        };
      }

      // Get total income from tenant payments
      const { data: payments, error: paymentsError } = await supabase
        .from('tenant_payments')
        .select('amount')
        .in('tenant_id', tenantIds);
      
      if (paymentsError) throw paymentsError;
      
      // Get expenses for this property
      const { data: expenses, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('amount')
        .eq('property_id', propertyId);
      
      if (expensesError) throw expensesError;
      
      // Get property value (for ROI calculation) - approximated at 20x annual rent
      const { data: property } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      const totalIncome = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const netIncome = totalIncome - totalExpenses;
      
      // Calculate approximate ROI (simplified)
      // For a real app, you would need actual property value data
      const propertyValue = property ? (totalIncome * 20) : 100000; // Approximation
      const roi = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;
      
      return {
        totalIncome,
        totalExpenses,
        netIncome,
        roi
      };
    },
    enabled: !!propertyId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!propertyId) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-6 text-center text-muted-foreground">
          {t('selectPropertyToViewMetrics')}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardMetric
        title={t('totalIncome')}
        value={`$${(financialData?.totalIncome || 0).toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
        description={t('allTimeIncome')}
        chartColor="#22C55E"
      />
      
      <DashboardMetric
        title={t('totalExpenses')}
        value={`$${(financialData?.totalExpenses || 0).toLocaleString()}`}
        icon={<Wallet className="h-4 w-4" />}
        description={t('allTimeExpenses')}
        chartColor="#F43F5E"
      />
      
      <DashboardMetric
        title={t('netIncome')}
        value={`$${(financialData?.netIncome || 0).toLocaleString()}`}
        icon={<Landmark className="h-4 w-4" />}
        description={t('totalProfit')}
        chartColor="#3B82F6"
      />
      
      <DashboardMetric
        title="ROI"
        value={`${(financialData?.roi || 0).toFixed(2)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description={t('returnOnInvestment')}
        chartColor="#8B5CF6"
      />
    </div>
  );
}

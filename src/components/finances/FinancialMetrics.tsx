
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FinancialKPI from "./FinancialKPI";
import { TrendingUp, DollarSign, Building2, AlertCircle } from "lucide-react";

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
          roi: 0,
          occupancyRate: 0,
          unpaidRent: 0,
          unpaidTenants: 0,
          incomeChange: 0,
          expenseChange: 0,
          occupancyChange: 0
        };
      }

      // Get total income from tenant payments
      const { data: payments, error: paymentsError } = await supabase
        .from('tenant_payments')
        .select('amount, status, payment_date')
        .in('tenant_id', tenantIds);
      
      if (paymentsError) throw paymentsError;
      
      // Get expenses for this property
      const { data: expenses, error: expensesError } = await supabase
        .from('maintenance_expenses')
        .select('amount, date')
        .eq('property_id', propertyId);
      
      if (expensesError) throw expensesError;
      
      // Calculate this month's and last month's data
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
      
      // Calculate income for current and previous month
      const thisMonthIncome = payments?.filter(p => {
        const date = new Date(p.payment_date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      const lastMonthIncome = payments?.filter(p => {
        const date = new Date(p.payment_date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      }).reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      // Calculate expenses for current and previous month
      const thisMonthExpenses = expenses?.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).reduce((sum, expense) => sum + expense.amount, 0) || 0;
      
      const lastMonthExpenses = expenses?.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      }).reduce((sum, expense) => sum + expense.amount, 0) || 0;
      
      // Calculate income change percentage
      const incomeChange = lastMonthIncome > 0
        ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
        : 0;
      
      // Calculate expense change percentage
      const expenseChange = lastMonthExpenses > 0
        ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;
      
      // Get property units and calculate occupancy rate
      const { data: property } = await supabase
        .from('properties')
        .select('units')
        .eq('id', propertyId)
        .single();
      
      const totalUnits = property?.units || 1;
      const occupiedUnits = tenantIds.length;
      const occupancyRate = (occupiedUnits / totalUnits) * 100;
      
      // Calculate occupancy change (assume +5% for demo)
      const occupancyChange = 5;
      
      // Calculate unpaid rent
      const unpaidPayments = payments?.filter(p => p.status === 'pending' || p.status === 'late') || [];
      const unpaidRent = unpaidPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const unpaidTenants = new Set(unpaidPayments.map(p => p.tenant_id)).size;
      
      // Calculate total values for all time
      const totalIncome = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const netIncome = totalIncome - totalExpenses;
      
      // Calculate approximate ROI (simplified)
      const propertyValue = property ? (totalIncome * 20) : 100000; // Approximation
      const roi = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;
      
      return {
        totalIncome,
        totalExpenses,
        netIncome,
        roi,
        occupancyRate,
        unpaidRent,
        unpaidTenants,
        thisMonthIncome,
        thisMonthExpenses,
        incomeChange,
        expenseChange,
        occupancyChange
      };
    },
    enabled: !!propertyId
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[140px] w-full" />
        ))}
      </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialKPI
        title={t('income')}
        value={`${(financialData?.thisMonthIncome || 0).toLocaleString()} €`}
        trend={{
          value: `${Math.abs(financialData?.incomeChange || 0).toFixed(1)}%`,
          isPositive: (financialData?.incomeChange || 0) >= 0,
          label: t('monthly')
        }}
        icon={<DollarSign className="h-5 w-5 text-green-600" />}
      />
      
      <FinancialKPI
        title={t('expenses')}
        value={`${(financialData?.thisMonthExpenses || 0).toLocaleString()} €`}
        trend={{
          value: `${Math.abs(financialData?.expenseChange || 0).toFixed(1)}%`,
          isPositive: (financialData?.expenseChange || 0) <= 0,
          label: t('monthly')
        }}
        icon={<TrendingUp className="h-5 w-5 text-red-600" />}
      />
      
      <FinancialKPI
        title={t('occupancyRate')}
        value={`${Math.round(financialData?.occupancyRate || 0)}%`}
        trend={{
          value: `${Math.abs(financialData?.occupancyChange || 0)}%`,
          isPositive: (financialData?.occupancyChange || 0) >= 0,
          label: t('monthly')
        }}
        icon={<Building2 className="h-5 w-5 text-blue-600" />}
      />
      
      <FinancialKPI
        title={t('unpaidRent')}
        value={`${(financialData?.unpaidRent || 0).toLocaleString()} €`}
        trend={{
          value: `${financialData?.unpaidTenants || 0}`,
          isPositive: false,
          label: financialData?.unpaidTenants === 1 ? t('tenant') : t('tenants')
        }}
        icon={<AlertCircle className="h-5 w-5 text-yellow-600" />}
      />
    </div>
  );
}

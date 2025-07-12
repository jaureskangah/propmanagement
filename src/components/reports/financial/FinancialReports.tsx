import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2 } from "lucide-react";
import { GlobalExportOptions } from "../shared/GlobalExportOptions";
import FinancialOverview from "@/components/finances/FinancialOverview";
import { MetricsCards } from "@/components/maintenance/financials/MetricsCards";
import PropertyFinancialSelector from "@/components/finances/PropertyFinancialSelector";

export const FinancialReports = () => {
  const { t } = useLocale();
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string | null>(null);

  // Fetch financial data
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ['tenant_payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenant_payments').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['maintenance_expenses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_expenses').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const isLoading = isLoadingPayments || isLoadingExpenses || isLoadingProperties;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const financialData = {
    payments,
    expenses,
    properties
  };

  // Calculate summary metrics
  const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  // ROI basé sur les dépenses engagées
  const roi = totalExpenses > 0 ? ((netIncome / totalExpenses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with export options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('financialReports', { fallback: 'Rapports Financiers' })}
          </h2>
          <p className="text-muted-foreground">
            {t('comprehensiveFinancialAnalysis', { fallback: 'Analyse financière complète' })}
          </p>
        </div>
        <GlobalExportOptions data={financialData} type="financial" />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('totalRevenue', { fallback: 'Revenus Totaux' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('totalExpenses', { fallback: 'Dépenses Totales' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('netIncome', { fallback: 'Revenu Net' })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {t('roi', { fallback: 'ROI sur dépenses' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Cards */}
      <MetricsCards
        expenses={expenses}
        maintenance={[]}
        rentData={payments}
      />

      {/* Financial Overview per Property */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle>
            {t('financialOverviewByProperty', { fallback: 'Vue d\'ensemble par propriété' })}
          </CardTitle>
          <PropertyFinancialSelector
            properties={properties.map(p => ({ id: p.id, name: p.name }))}
            isLoading={isLoadingProperties}
            selectedPropertyId={selectedPropertyId || properties[0]?.id || null}
            onPropertySelect={setSelectedPropertyId}
          />
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <FinancialOverview 
              propertyId={selectedPropertyId || properties[0]?.id || null}
              selectedYear={new Date().getFullYear()}
            />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {t('noPropertiesFound', { fallback: 'Aucune propriété trouvée' })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import { useQueryCache } from "@/hooks/useQueryCache";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function useFinancialMetrics(propertyId: string | null, selectedYear: number) {
  const { toast } = useToast();
  
  // Utiliser notre hook de cache pour optimiser cette requête coûteuse
  const {
    data: financialData,
    isLoading,
    error,
    refetch: refreshData
  } = useQueryCache(
    ['financial_metrics', propertyId, selectedYear.toString()],
    async () => {
      if (!propertyId) return null;

      console.log("Fetching financial metrics with optimization for property:", propertyId, "year:", selectedYear);
      
      try {
        // Utiliser un seul appel de base de données au lieu de plusieurs appels séparés
        // pour réduire les allers-retours réseau
        const { data: results, error } = await supabase.rpc('get_financial_metrics', {
          p_property_id: propertyId,
          p_year: selectedYear
        });
        
        if (error) throw error;
        
        if (!results) {
          console.log("No metrics found, returning default data");
          return {
            totalRevenue: 0,
            totalExpenses: 0,
            netIncome: 0,
            occupancyRate: 0,
            changeFromPrevPeriod: {
              revenue: 0,
              expenses: 0,
              income: 0,
              occupancy: 0
            },
            monthlyData: []
          };
        }
        
        return results;
      } catch (error) {
        // Si la fonction RPC n'existe pas encore, on utilise la méthode originale
        console.log("Fallback to original method for financial metrics fetch");
        return await fetchFinancialMetricsOriginalMethod(propertyId, selectedYear);
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!propertyId
    }
  );

  // Périodiquement vérifier s'il y a des mises à jour (mais pas trop fréquemment)
  useEffect(() => {
    if (!propertyId) return;
    
    const checkForUpdatesInterval = setInterval(() => {
      const shouldRefresh = Math.random() < 0.3; // ~30% chance to refresh
      if (shouldRefresh) {
        console.log("Background refresh of financial metrics");
        refreshData();
      }
    }, 10 * 60 * 1000); // Vérifier toutes les 10 minutes
    
    return () => clearInterval(checkForUpdatesInterval);
  }, [propertyId, refreshData]);

  return {
    financialData,
    isLoading,
    error,
    refreshData
  };
}

// Méthode de secours au cas où la fonction RPC n'est pas disponible
async function fetchFinancialMetricsOriginalMethod(propertyId: string, selectedYear: number) {
  console.log("Using original method for financial metrics");

  // Fetch tenants
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, unit_number, rent_amount')
    .eq('property_id', propertyId);
  
  if (!tenants?.length) {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0,
      occupancyRate: 0,
      changeFromPrevPeriod: {
        revenue: 0,
        expenses: 0,
        income: 0,
        occupancy: 0
      },
      monthlyData: []
    };
  }
  
  const tenantIds = tenants.map(t => t.id);
  
  // Année et période précédente pour comparaison
  const prevYear = selectedYear - 1;
  const currentYearStart = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
  const currentYearEnd = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
  const prevYearStart = new Date(prevYear, 0, 1).toISOString().split('T')[0];
  const prevYearEnd = new Date(prevYear, 11, 31).toISOString().split('T')[0];
  
  // Faire les requêtes en parallèle pour plus d'efficacité
  const [
    paymentsResponse,
    expensesResponse,
    interventionsResponse,
    propertyResponse,
    prevPaymentsResponse,
    prevExpensesResponse,
    prevInterventionsResponse
  ] = await Promise.all([
    // Current year data
    supabase
      .from('tenant_payments')
      .select('amount, status, tenant_id, payment_date')
      .in('tenant_id', tenantIds)
      .gte('payment_date', currentYearStart)
      .lte('payment_date', currentYearEnd),
      
    supabase
      .from('maintenance_expenses')
      .select('amount, date')
      .eq('property_id', propertyId)
      .gte('date', currentYearStart)
      .lte('date', currentYearEnd),
      
    supabase
      .from('vendor_interventions')
      .select('cost, date')
      .eq('property_id', propertyId)
      .gte('date', currentYearStart)
      .lte('date', currentYearEnd),
      
    supabase
      .from('properties')
      .select('units')
      .eq('id', propertyId)
      .single(),
      
    // Previous year data
    supabase
      .from('tenant_payments')
      .select('amount, status')
      .in('tenant_id', tenantIds)
      .gte('payment_date', prevYearStart)
      .lte('payment_date', prevYearEnd),
      
    supabase
      .from('maintenance_expenses')
      .select('amount')
      .eq('property_id', propertyId)
      .gte('date', prevYearStart)
      .lte('date', prevYearEnd),
      
    supabase
      .from('vendor_interventions')
      .select('cost')
      .eq('property_id', propertyId)
      .gte('date', prevYearStart)
      .lte('date', prevYearEnd)
  ]);
  
  // Traiter les résultats  
  const payments = paymentsResponse.data || [];
  const expenses = expensesResponse.data || [];
  const interventions = interventionsResponse.data || [];
  const property = propertyResponse.data;
  const prevPayments = prevPaymentsResponse.data || [];
  const prevExpenses = prevExpensesResponse.data || [];
  const prevInterventions = prevInterventionsResponse.data || [];
  
  // Calculer les métriques actuelles
  const totalRevenue = payments.reduce((sum, payment) => 
    sum + (Number(payment.amount) || 0), 0);
  
  const totalExpenses = expenses.reduce((sum, expense) => 
    sum + (Number(expense.amount) || 0), 0) + 
    interventions.reduce((sum, intervention) => 
      sum + (Number(intervention.cost) || 0), 0);
  
  const netIncome = totalRevenue - totalExpenses;
  
  const occupancyRate = property?.units > 0 
    ? (tenants.length / property.units) * 100 
    : 0;
  
  // Calculer les métriques de l'année précédente
  const prevTotalRevenue = prevPayments.reduce((sum, payment) => 
    sum + (Number(payment.amount) || 0), 0);
  
  const prevTotalExpenses = prevExpenses.reduce((sum, expense) => 
    sum + (Number(expense.amount) || 0), 0) + 
    prevInterventions.reduce((sum, intervention) => 
      sum + (Number(intervention.cost) || 0), 0);
  
  const prevNetIncome = prevTotalRevenue - prevTotalExpenses;
  
  // Calculer les changements en pourcentage
  const calculatePercentChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Traiter les données mensuelles pour les graphiques
  const monthlyData = processMonthlyData(payments, expenses, interventions, selectedYear);
  
  return {
    totalRevenue,
    totalExpenses,
    netIncome,
    occupancyRate,
    changeFromPrevPeriod: {
      revenue: calculatePercentChange(totalRevenue, prevTotalRevenue),
      expenses: calculatePercentChange(totalExpenses, prevTotalExpenses),
      income: calculatePercentChange(netIncome, prevNetIncome),
      occupancy: 0 // Nous n'avons pas les données d'occupation précédentes
    },
    monthlyData
  };
}

// Fonction pour traiter les données mensuelles pour les graphiques
function processMonthlyData(payments: any[], expenses: any[], interventions: any[], year: number) {
  const months = Array(12).fill(0).map((_, i) => {
    const month = i + 1;
    return {
      month: month,
      monthName: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
      revenue: 0,
      expenses: 0,
      profit: 0
    };
  });

  // Traiter les paiements
  payments.forEach(payment => {
    if (!payment.payment_date) return;
    
    const date = new Date(payment.payment_date);
    if (date.getFullYear() !== year) return;
    
    const monthIndex = date.getMonth();
    months[monthIndex].revenue += Number(payment.amount) || 0;
  });

  // Traiter les dépenses de maintenance
  expenses.forEach(expense => {
    if (!expense.date) return;
    
    const date = new Date(expense.date);
    if (date.getFullYear() !== year) return;
    
    const monthIndex = date.getMonth();
    months[monthIndex].expenses += Number(expense.amount) || 0;
  });

  // Traiter les interventions de vendeur
  interventions.forEach(intervention => {
    if (!intervention.date) return;
    
    const date = new Date(intervention.date);
    if (date.getFullYear() !== year) return;
    
    const monthIndex = date.getMonth();
    months[monthIndex].expenses += Number(intervention.cost) || 0;
  });

  // Calculer les profits
  months.forEach(month => {
    month.profit = month.revenue - month.expenses;
  });

  return months;
}

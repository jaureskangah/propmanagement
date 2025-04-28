
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Wallet } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { processMonthlyData } from "@/components/finances/charts/utils/chartProcessing";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
  selectedYear: number;
  rentData: any[];
}

export const MetricsCards = ({ 
  propertyId, 
  expenses, 
  maintenance, 
  calculateROI,
  selectedYear,
  rentData
}: MetricsCardsProps) => {
  const { t } = useLocale();
  
  // Refetch rent data specifically for this property and year
  const { data: propertyRentData = [] } = useQuery({
    queryKey: ["property_rent_payments_exact", propertyId, selectedYear],
    queryFn: async () => {
      console.log(`Fetching exact rent data for property ${propertyId} in year ${selectedYear}`);
      try {
        // First get tenants for this property
        const { data: tenants, error: tenantsError } = await supabase
          .from("tenants")
          .select("id")
          .eq("property_id", propertyId);
          
        if (tenantsError) throw tenantsError;
        
        if (!tenants?.length) {
          console.log("No tenants found for property", propertyId);
          return [];
        }
        
        const tenantIds = tenants.map(t => t.id);
        console.log("Found tenants for property:", tenantIds);
        
        // Format dates correctly to ensure proper filtering
        const startOfYear = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        const endOfYear = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        
        console.log("Date range for payments:", startOfYear, "to", endOfYear);
        
        // Then get payments for these tenants within the selected year
        const { data: payments, error: paymentsError } = await supabase
          .from("tenant_payments")
          .select("*")
          .in("tenant_id", tenantIds)
          .gte("payment_date", startOfYear)
          .lte("payment_date", endOfYear);

        if (paymentsError) throw paymentsError;
        
        console.log(`Fetched ${payments?.length || 0} payments for property ${propertyId} in year ${selectedYear}:`, payments);
        return payments || [];
      } catch (error) {
        console.error("Error fetching property rent data:", error);
        return [];
      }
    },
    enabled: !!propertyId && selectedYear > 0
  });

  // Normaliser les données pour assurer la cohérence 
  const normalizeExpenses = () => {
    try {
      // Vérifier que les entrées sont des tableaux valides avant de procéder
      if (!Array.isArray(expenses)) {
        console.warn("Les dépenses ne sont pas un tableau valide:", expenses);
        return [];
      }
      
      if (!Array.isArray(maintenance)) {
        console.warn("Les interventions de maintenance ne sont pas un tableau valide:", maintenance);
        return [];
      }

      // Normaliser les objets de maintenance_expenses avec validation
      const normalizedExpenses = expenses
        .filter(expense => expense && typeof expense === 'object')
        .map(expense => ({
          amount: typeof expense.amount === 'number' ? expense.amount : 0,
          date: expense.date || new Date().toISOString()
        }));

      // Normaliser les objets de vendor_interventions avec validation
      const normalizedMaintenance = maintenance
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          amount: typeof item.cost === 'number' ? item.cost : 0,
          date: item.date || new Date().toISOString()
        }));

      // Fusionner les deux ensembles de données normalisés
      console.log("Expenses normalized:", normalizedExpenses.length, "Maintenance normalized:", normalizedMaintenance.length);
      return [...normalizedExpenses, ...normalizedMaintenance];
    } catch (error) {
      console.error("Erreur lors de la normalisation des dépenses:", error);
      return [];
    }
  };

  // Utilisation de la même logique que dans le composant Finances
  const allExpenses = normalizeExpenses();
  console.log("All normalized expenses:", allExpenses.length);
  
  // Calculer la somme des dépenses pour l'année sélectionnée
  let totalExpenses = 0;
  
  try {
    // Si nous avons des données de dépenses, utilisons processMonthlyData
    if (allExpenses.length > 0) {
      const currentYearData = processMonthlyData(allExpenses, [], selectedYear);
      totalExpenses = currentYearData.reduce((acc, month) => acc + month.expenses, 0);
    }
    
    // Vérification supplémentaire pour éviter NaN
    if (isNaN(totalExpenses)) {
      console.warn("Total expenses is NaN, setting to 0");
      totalExpenses = 0;
    }
  } catch (error) {
    console.error("Erreur lors du calcul des dépenses totales:", error);
    totalExpenses = 0;
  }
  
  // Calculer le total des revenus de loyers
  let totalRentPaid = 0;
  
  try {
    totalRentPaid = propertyRentData
      .filter(payment => payment && payment.status === "paid" && typeof payment.amount === 'number')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    // Vérification supplémentaire pour éviter NaN
    if (isNaN(totalRentPaid)) {
      console.warn("Total rent paid is NaN, setting to 0");
      totalRentPaid = 0;
    }
  } catch (error) {
    console.error("Erreur lors du calcul des loyers payés:", error);
    totalRentPaid = 0;
  }
  
  console.log("MetricsCards - Totaux calculés:", {
    totalExpenses,
    totalRentPaid,
    propertyId, 
    year: selectedYear, 
    expensesCount: expenses?.length || 0,
    maintenanceCount: maintenance?.length || 0,
    combinedExpensesCount: allExpenses.length
  });

  const metrics = [
    {
      title: t('totalExpenses'),
      value: `$${totalExpenses.toLocaleString()}`,
      icon: <FileText className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-rose-500",
      bgColor: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
      borderColor: "border-rose-100 dark:border-rose-800/30 hover:border-rose-200 dark:hover:border-rose-700/40",
    },
    {
      title: "ROI",
      value: `${calculateROI()}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: t('annualReturn'),
      color: "text-blue-500",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40",
    },
    {
      title: t('totalRentPaid'),
      value: `$${totalRentPaid.toLocaleString()}`,
      icon: <Wallet className="h-4 w-4" />,
      description: t('yearToDate'),
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card 
          key={metric.title}
          className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br ${metric.bgColor} ${metric.borderColor}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm ${metric.color}`}>
                  {metric.icon}
                </div>
                <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors dark:text-gray-300">{metric.title}</h3>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in dark:text-white">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5 dark:text-gray-400">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

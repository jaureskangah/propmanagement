
import React from "react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { FileText, TrendingUp, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MetricsCardsProps {
  propertyId: string;
  expenses: any[];
  maintenance: any[];
  calculateROI: () => string;
}

export const MetricsCards = ({ propertyId, expenses, maintenance, calculateROI }: MetricsCardsProps) => {
  const { t, language } = useLocale();
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMaintenance = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  // Fetch total rent payments for the property
  const { data: totalRentPaid = 0 } = useQuery({
    queryKey: ["total_rent_paid", propertyId],
    queryFn: async () => {
      console.log("Fetching total rent paid for property:", propertyId);
      
      const { data: tenants, error: tenantsError } = await supabase
        .from("tenants")
        .select("id")
        .eq("property_id", propertyId);

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError);
        throw tenantsError;
      }

      if (!tenants?.length) return 0;

      const tenantIds = tenants.map(t => t.id);
      
      const { data: payments, error: paymentsError } = await supabase
        .from("tenant_payments")
        .select("amount")
        .in("tenant_id", tenantIds)
        .eq("status", "paid");

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }

      const total = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      console.log("Total rent paid:", total);
      return total;
    },
  });

  // Déterminer les textes à afficher selon la langue
  const titles = {
    totalExpenses: language === 'fr' ? "Dépenses Totales" : "Total Expenses",
    roi: "ROI",  // Acronyme universel
    totalRentPaid: language === 'fr' ? "Loyers Perçus" : "Total Rent Paid",
    yearToDate: language === 'fr' ? "Année en cours" : "Year to date",
    annualReturn: language === 'fr' ? "Rendement annuel" : "Annual return",
    allTime: language === 'fr' ? "Au total" : "All time"
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardMetric
        title={titles.totalExpenses}
        value={`$${(totalExpenses + totalMaintenance).toLocaleString()}`}
        icon={<FileText className="h-4 w-4" />}
        description={titles.yearToDate}
      />

      <DashboardMetric
        title={titles.roi}
        value={`${calculateROI()}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        description={titles.annualReturn}
      />

      <DashboardMetric
        title={titles.totalRentPaid}
        value={`$${totalRentPaid.toLocaleString()}`}
        icon={<Wallet className="h-4 w-4" />}
        description={titles.allTime}
        chartColor="#22C55E"
      />
    </div>
  );
};

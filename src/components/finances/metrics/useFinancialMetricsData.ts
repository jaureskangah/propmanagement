
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { FinancialData } from "./types";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

export function useFinancialMetricsData(propertyId: string | null) {
  return useQuery({
    queryKey: ['financial_metrics', propertyId],
    queryFn: async (): Promise<FinancialData | null> => {
      if (!propertyId) return null;

      console.log("Fetching financial metrics for property:", propertyId);
      
      // Current date range
      const currentDate = new Date();
      const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
      const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));
      
      // Fetch payments for this property (via tenants) - current period
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, unit_number, rent_amount')
        .eq('property_id', propertyId);

      const tenantIds = tenants?.map(t => t.id) || [];
      
      // If no tenants, return default data
      if (tenantIds.length === 0) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          occupancyRate: 0,
          unpaidRent: 0,
          trends: {
            totalIncomeTrend: 0,
            totalExpensesTrend: 0,
            occupancyRateTrend: 0,
            unpaidRentTrend: 0
          }
        };
      }

      // Current period data
      // Récupérer le revenu total des paiements des locataires
      const { data: payments, error: paymentsError } = await supabase
        .from('tenant_payments')
        .select('amount, status, tenant_id, payment_date')
        .in('tenant_id', tenantIds);
      
      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }
      
      // Récupérer TOUTES les dépenses pour cette propriété
      // 1. maintenance_expenses
      const { data: maintenanceExpenses, error: maintenanceExpensesError } = await supabase
        .from('maintenance_expenses')
        .select('amount, date')
        .eq('property_id', propertyId);
      
      if (maintenanceExpensesError) {
        console.error("Error fetching maintenance expenses:", maintenanceExpensesError);
        throw maintenanceExpensesError;
      }
      
      // 2. vendor_interventions (inclus comme dépenses)
      const { data: vendorInterventions, error: vendorInterventionsError } = await supabase
        .from('vendor_interventions')
        .select('cost, date')
        .eq('property_id', propertyId);
        
      if (vendorInterventionsError) {
        console.error("Error fetching vendor interventions:", vendorInterventionsError);
        throw vendorInterventionsError;
      }
      
      // Récupérer les détails de la propriété pour calculer le taux d'occupation
      const { data: property } = await supabase
        .from('properties')
        .select('units')
        .eq('id', propertyId)
        .single();
      
      // Previous period data - Get payments from previous month
      const { data: previousPayments } = await supabase
        .from('tenant_payments')
        .select('amount, status, tenant_id, payment_date')
        .in('tenant_id', tenantIds)
        .gte('payment_date', previousMonthStart.toISOString().split('T')[0])
        .lte('payment_date', previousMonthEnd.toISOString().split('T')[0]);

      // Previous period expenses
      const { data: prevMaintenanceExpenses } = await supabase
        .from('maintenance_expenses')
        .select('amount, date')
        .eq('property_id', propertyId)
        .gte('date', previousMonthStart.toISOString().split('T')[0])
        .lte('date', previousMonthEnd.toISOString().split('T')[0]);

      const { data: prevVendorInterventions } = await supabase
        .from('vendor_interventions')
        .select('cost, date')
        .eq('property_id', propertyId)
        .gte('date', previousMonthStart.toISOString().split('T')[0])
        .lte('date', previousMonthEnd.toISOString().split('T')[0]);
        
      // Previous month tenant count for occupancy calculation
      const { data: previousTenants } = await supabase
        .from('tenants')
        .select('id, unit_number')
        .eq('property_id', propertyId)
        .lte('created_at', previousMonthEnd.toISOString());
        
      // CURRENT PERIOD CALCULATIONS
      // Calcul du revenu total
      const totalIncome = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      // Calcul des dépenses totales (maintenance + interventions)
      const maintenanceExpensesTotal = maintenanceExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const vendorInterventionsTotal = vendorInterventions?.reduce((sum, intervention) => sum + Number(intervention.cost || 0), 0) || 0;
      const totalExpenses = maintenanceExpensesTotal + vendorInterventionsTotal;
      
      // Calcul du taux d'occupation (nombre d'unités avec locataires / total des unités)
      const totalUnits = property?.units || 0;
      const occupiedUnits = new Set(tenants?.map(t => t.unit_number)).size;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      
      // Calculer les loyers impayés (paiements avec statut 'pending' ou 'overdue')
      const pendingPayments = payments
        ?.filter(payment => payment.status === 'pending' || payment.status === 'overdue')
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      // Calculer les loyers attendus mais non enregistrés
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const expectedRent = tenants?.reduce((total, tenant) => total + Number(tenant.rent_amount || 0), 0) || 0;
      
      // Recherche des paiements pour le mois en cours
      const currentMonthPayments = payments?.filter(payment => {
        if (!payment.payment_date) return false;
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });
      
      // Montant total payé ce mois-ci
      const currentMonthPaid = currentMonthPayments?.reduce(
        (total, payment) => payment.status === 'paid' ? total + Number(payment.amount) : total, 
        0
      ) || 0;
      
      // Loyers impayés = montant attendu pour le mois - montant déjà payé + paiements en attente ou en retard
      const unpaidRent = Math.max(0, expectedRent - currentMonthPaid) + pendingPayments;
      
      // PREVIOUS PERIOD CALCULATIONS
      // Previous period income
      const prevTotalIncome = previousPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      // Previous period expenses
      const prevMaintenanceTotal = prevMaintenanceExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const prevInterventionsTotal = prevVendorInterventions?.reduce((sum, intervention) => sum + Number(intervention.cost || 0), 0) || 0;
      const prevTotalExpenses = prevMaintenanceTotal + prevInterventionsTotal;
      
      // Previous period occupancy rate
      const prevOccupiedUnits = previousTenants ? new Set(previousTenants.map(t => t.unit_number)).size : 0;
      const prevOccupancyRate = totalUnits > 0 ? (prevOccupiedUnits / totalUnits) * 100 : 0;

      // Previous period unpaid rent - simplified calculation for comparison
      // We'll use the percentage of unpaid rent to total expected rent for trend calculation
      const prevMonthExpectedRent = expectedRent; // Assuming similar rent expectations
      const prevUnpaidRent = previousPayments
        ?.filter(payment => payment.status === 'pending' || payment.status === 'overdue')
        .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      // TREND CALCULATIONS
      // Calculate trends (percentage changes) - now rounding to whole numbers
      const calculateTrend = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };
      
      const totalIncomeTrend = calculateTrend(totalIncome, prevTotalIncome);
      const totalExpensesTrend = calculateTrend(totalExpenses, prevTotalExpenses);
      const occupancyRateTrend = calculateTrend(occupancyRate, prevOccupancyRate);
      const unpaidRentTrend = calculateTrend(unpaidRent, prevUnpaidRent);
      
      console.log("Financial metrics calculated:", {
        totalIncome,
        prevTotalIncome,
        totalIncomeTrend,
        totalExpenses,
        prevTotalExpenses,
        totalExpensesTrend,
        occupancyRate,
        prevOccupancyRate,
        occupancyRateTrend,
        unpaidRent,
        prevUnpaidRent,
        unpaidRentTrend,
        expectedRent,
        currentMonthPaid,
        pendingPayments
      });
      
      return {
        totalIncome,
        totalExpenses,
        occupancyRate,
        unpaidRent,
        trends: {
          totalIncomeTrend,
          totalExpensesTrend,
          occupancyRateTrend,
          unpaidRentTrend
        }
      };
    },
    enabled: !!propertyId
  });
}

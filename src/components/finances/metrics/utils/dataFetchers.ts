
import { supabase } from "@/lib/supabase";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

/**
 * Fetches tenants for a specific property
 */
export async function fetchPropertyTenants(propertyId: string) {
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('id, unit_number, rent_amount')
    .eq('property_id', propertyId);
    
  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
  
  return tenants || [];
}

/**
 * Fetches payments for a list of tenant IDs
 */
export async function fetchTenantPayments(tenantIds: string[]) {
  if (tenantIds.length === 0) return [];
  
  const { data: payments, error } = await supabase
    .from('tenant_payments')
    .select('amount, status, tenant_id, payment_date')
    .in('tenant_id', tenantIds);
  
  if (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
  
  return payments || [];
}

/**
 * Fetches maintenance expenses for a property
 */
export async function fetchMaintenanceExpenses(propertyId: string) {
  const { data: maintenanceExpenses, error } = await supabase
    .from('maintenance_expenses')
    .select('amount, date')
    .eq('property_id', propertyId);
  
  if (error) {
    console.error("Error fetching maintenance expenses:", error);
    throw error;
  }
  
  return maintenanceExpenses || [];
}

/**
 * Fetches vendor interventions for a property
 */
export async function fetchVendorInterventions(propertyId: string) {
  const { data: vendorInterventions, error } = await supabase
    .from('vendor_interventions')
    .select('cost, date')
    .eq('property_id', propertyId);
    
  if (error) {
    console.error("Error fetching vendor interventions:", error);
    throw error;
  }
  
  return vendorInterventions || [];
}

/**
 * Fetches property details
 */
export async function fetchPropertyDetails(propertyId: string) {
  const { data: property, error } = await supabase
    .from('properties')
    .select('units')
    .eq('id', propertyId)
    .single();
  
  if (error) {
    console.error("Error fetching property details:", error);
    throw error;
  }
  
  return property;
}

/**
 * Fetches data for previous period
 */
export async function fetchPreviousPeriodData(
  propertyId: string, 
  tenantIds: string[]
) {
  // Define previous month date range
  const currentDate = new Date();
  const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
  const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));
  const prevMonthStartStr = previousMonthStart.toISOString().split('T')[0];
  const prevMonthEndStr = previousMonthEnd.toISOString().split('T')[0];
  
  // Previous payments
  const { data: previousPayments } = await supabase
    .from('tenant_payments')
    .select('amount, status, tenant_id, payment_date')
    .in('tenant_id', tenantIds)
    .gte('payment_date', prevMonthStartStr)
    .lte('payment_date', prevMonthEndStr);

  // Previous maintenance expenses
  const { data: prevMaintenanceExpenses } = await supabase
    .from('maintenance_expenses')
    .select('amount, date')
    .eq('property_id', propertyId)
    .gte('date', prevMonthStartStr)
    .lte('date', prevMonthEndStr);

  // Previous vendor interventions
  const { data: prevVendorInterventions } = await supabase
    .from('vendor_interventions')
    .select('cost, date')
    .eq('property_id', propertyId)
    .gte('date', prevMonthStartStr)
    .lte('date', prevMonthEndStr);
    
  // Previous tenants for occupancy calculation
  const { data: previousTenants } = await supabase
    .from('tenants')
    .select('id, unit_number')
    .eq('property_id', propertyId)
    .lte('created_at', previousMonthEnd.toISOString());
    
  return {
    previousPayments: previousPayments || [],
    prevMaintenanceExpenses: prevMaintenanceExpenses || [],
    prevVendorInterventions: prevVendorInterventions || [],
    previousTenants: previousTenants || []
  };
}

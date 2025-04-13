
import { supabase } from "@/lib/supabase";
import { subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

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
 * Fetches payments for a list of tenant IDs filtered by year
 */
export async function fetchTenantPayments(tenantIds: string[], year: number) {
  if (tenantIds.length === 0) return [];
  
  const startDate = startOfYear(new Date(year, 0, 1)).toISOString().split('T')[0];
  const endDate = endOfYear(new Date(year, 11, 31)).toISOString().split('T')[0];
  
  const { data: payments, error } = await supabase
    .from('tenant_payments')
    .select('amount, status, tenant_id, payment_date')
    .in('tenant_id', tenantIds)
    .gte('payment_date', startDate)
    .lte('payment_date', endDate);
  
  if (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
  
  return payments || [];
}

/**
 * Fetches maintenance expenses for a property filtered by year
 */
export async function fetchMaintenanceExpenses(propertyId: string, year: number) {
  const startDate = startOfYear(new Date(year, 0, 1)).toISOString().split('T')[0];
  const endDate = endOfYear(new Date(year, 11, 31)).toISOString().split('T')[0];
  
  const { data: maintenanceExpenses, error } = await supabase
    .from('maintenance_expenses')
    .select('amount, date')
    .eq('property_id', propertyId)
    .gte('date', startDate)
    .lte('date', endDate);
  
  if (error) {
    console.error("Error fetching maintenance expenses:", error);
    throw error;
  }
  
  return maintenanceExpenses || [];
}

/**
 * Fetches vendor interventions for a property filtered by year
 */
export async function fetchVendorInterventions(propertyId: string, year: number) {
  const startDate = startOfYear(new Date(year, 0, 1)).toISOString().split('T')[0];
  const endDate = endOfYear(new Date(year, 11, 31)).toISOString().split('T')[0];
  
  const { data: vendorInterventions, error } = await supabase
    .from('vendor_interventions')
    .select('cost, date')
    .eq('property_id', propertyId)
    .gte('date', startDate)
    .lte('date', endDate);
    
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
  tenantIds: string[],
  selectedYear: number
) {
  // For the previous year data
  const previousYear = selectedYear - 1;
  const prevYearStart = new Date(previousYear, 0, 1).toISOString().split('T')[0];
  const prevYearEnd = new Date(previousYear, 11, 31).toISOString().split('T')[0];
  
  // Previous payments
  const { data: previousPayments } = await supabase
    .from('tenant_payments')
    .select('amount, status, tenant_id, payment_date')
    .in('tenant_id', tenantIds)
    .gte('payment_date', prevYearStart)
    .lte('payment_date', prevYearEnd);

  // Previous maintenance expenses
  const { data: prevMaintenanceExpenses } = await supabase
    .from('maintenance_expenses')
    .select('amount, date')
    .eq('property_id', propertyId)
    .gte('date', prevYearStart)
    .lte('date', prevYearEnd);

  // Previous vendor interventions
  const { data: prevVendorInterventions } = await supabase
    .from('vendor_interventions')
    .select('cost, date')
    .eq('property_id', propertyId)
    .gte('date', prevYearStart)
    .lte('date', prevYearEnd);
    
  // Previous tenants for occupancy calculation
  const { data: previousTenants } = await supabase
    .from('tenants')
    .select('id, unit_number')
    .eq('property_id', propertyId)
    .lte('created_at', prevYearEnd);
    
  return {
    previousPayments: previousPayments || [],
    prevMaintenanceExpenses: prevMaintenanceExpenses || [],
    prevVendorInterventions: prevVendorInterventions || [],
    previousTenants: previousTenants || []
  };
}

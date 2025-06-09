
import type { Tenant } from "@/types/tenant";
import { SearchFilters } from "@/components/tenant/TenantSearch";

export const useTenantFiltering = (getPropertyName: (tenant: any) => string) => {
  const filterTenants = (tenant: Tenant, searchQuery: string, searchFilters: SearchFilters) => {
    const propertyName = getPropertyName(tenant);
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (propertyName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const today = new Date();
    const leaseEnd = new Date(tenant.lease_end);
    const monthsUntilEnd = (leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

    switch (searchFilters.leaseStatus) {
      case "active":
        return leaseEnd > today && monthsUntilEnd > 2;
      case "expiring":
        return leaseEnd > today && monthsUntilEnd <= 2;
      case "expired":
        return leaseEnd < today;
      default:
        return true;
    }
  };

  return { filterTenants };
};

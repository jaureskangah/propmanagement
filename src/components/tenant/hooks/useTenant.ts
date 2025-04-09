
import { useTenantContext } from "@/components/providers/TenantProvider";

export function useTenant() {
  return useTenantContext();
}

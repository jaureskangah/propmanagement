
import { useTenants } from "./useTenants";

export const useUpdateTenant = () => {
  const { updateTenant } = useTenants();
  return updateTenant;
};

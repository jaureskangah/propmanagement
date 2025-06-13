
import { useTenants } from "./useTenants";

export const useDeleteTenant = () => {
  const { deleteTenant } = useTenants();
  return deleteTenant;
};


import { useTenants } from "./useTenants";

export const useAddTenant = () => {
  const { addTenant } = useTenants();
  return addTenant;
};

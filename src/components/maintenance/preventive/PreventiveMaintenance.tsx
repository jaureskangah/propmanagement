
import { useLocale } from "@/components/providers/LocaleProvider";
import { PreventiveMaintenanceContent } from "./PreventiveMaintenanceContent";

export const PreventiveMaintenance = () => {
  const { t } = useLocale();
  
  return <PreventiveMaintenanceContent />;
};


import { DashboardCustomizationDialog } from "./customization/DashboardCustomizationDialog";

interface DashboardCustomizationProps {
  onOrderChange: (order: string[]) => void;
  onVisibilityChange: (hidden: string[]) => void;
  currentOrder: string[];
  hiddenSections: string[];
}

export const DashboardCustomization = (props: DashboardCustomizationProps) => {
  return <DashboardCustomizationDialog {...props} />;
};

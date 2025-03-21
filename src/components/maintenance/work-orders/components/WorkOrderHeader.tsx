
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderHeaderProps {
  onCreateWorkOrder: () => void;
}

export const WorkOrderHeader = ({ onCreateWorkOrder }: WorkOrderHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-card-foreground">{t('workOrders')}</h2>
      <Button onClick={onCreateWorkOrder} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('createOrder')}
      </Button>
    </div>
  );
};

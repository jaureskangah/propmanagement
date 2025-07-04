
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PaymentStatusProps {
  status: string;
}

export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const { t } = useLocale();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "payé":
        return {
          color: "bg-green-100 text-green-800 hover:bg-green-100/80",
          label: t('paid')
        };
      case "pending":
      case "en attente":
        return {
          color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
          label: t('pending')
        };
      case "overdue":
      case "en retard":
        return {
          color: "bg-red-100 text-red-800 hover:bg-red-100/80",
          label: t('overdue')
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={cn("font-medium", config.color)}>
      {config.label}
    </Badge>
  );
};


import { useLocale } from "@/components/providers/LocaleProvider";
import {
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceStatsProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
}

export const MaintenanceStats = ({
  totalRequests,
  pendingRequests,
  resolvedRequests,
}: MaintenanceStatsProps) => {
  const { t } = useLocale();

  const stats = [
    {
      label: t('totalRequests'),
      value: totalRequests,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/40",
    },
    {
      label: t('pendingRequests'),
      value: pendingRequests,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-100 dark:border-amber-800/40",
    },
    {
      label: t('resolvedRequests'),
      value: resolvedRequests,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-100 dark:border-green-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
            "transform hover:-translate-y-1 hover:shadow-md",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className={cn("p-2 rounded-full mb-2", stat.bgColor)}>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </div>
          <div className="text-xl font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

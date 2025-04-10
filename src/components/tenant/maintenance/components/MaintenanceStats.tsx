
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

interface MaintenanceStatsProps {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
}

export const MaintenanceStats = ({
  totalRequests,
  pendingRequests,
  resolvedRequests
}: MaintenanceStatsProps) => {
  const { t } = useLocale();

  const metrics = [
    {
      title: t('totalRequests'),
      value: totalRequests,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40",
    },
    {
      title: t('pendingRequests'),
      value: pendingRequests,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      borderColor: "border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40",
    },
    {
      title: t('resolvedRequests'),
      value: resolvedRequests,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.title}
          className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br ${metric.bgColor} ${metric.borderColor}`}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{metric.title}</span>
              <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in">
                {metric.value}
              </div>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm ${metric.color}`}>
              <metric.icon className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

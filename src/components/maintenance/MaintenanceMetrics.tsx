
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
}

export const MaintenanceMetrics = ({ total, pending, resolved }: MaintenanceMetricsProps) => {
  const { t } = useLocale();
  
  const metrics = [
    {
      title: t('totalRequests'),
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40",
      description: t('totalRequestsDesc')
    },
    {
      title: t('pendingRequests'),
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      borderColor: "border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40",
      description: t('pendingRequestsDesc')
    },
    {
      title: t('resolvedRequests'),
      value: resolved,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
      description: t('resolvedRequestsDesc')
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card 
            key={metric.title} 
            className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 border bg-gradient-to-br ${metric.bgColor} ${metric.borderColor} transform hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {metric.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm transition-all duration-300 group-hover:scale-110 ${metric.color}`}>
                <metric.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in">
                  {metric.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};

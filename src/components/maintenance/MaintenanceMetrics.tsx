
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface MaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
}

export const MaintenanceMetrics = ({ total, pending, resolved }: MaintenanceMetricsProps) => {
  const { t } = useLocale();
  
  // Calcul des pourcentages
  const pendingPercent = Math.round((pending / total) * 100) || 0;
  const resolvedPercent = Math.round((resolved / total) * 100) || 0;
  
  // Simulation de l'évolution par rapport au mois précédent
  // Dans une implémentation réelle, ces données viendraient d'une API
  const [prevPendingPercent, setPrevPendingPercent] = useState(pendingPercent + 5);
  const [prevResolvedPercent, setPrevResolvedPercent] = useState(resolvedPercent - 5);
  
  // Mise à jour des variations simulées lorsque les pourcentages changent
  useEffect(() => {
    setPrevPendingPercent(pendingPercent + 5);
    setPrevResolvedPercent(resolvedPercent - 5);
  }, [pendingPercent, resolvedPercent]);
  
  const pendingVariation = pendingPercent - prevPendingPercent;
  const resolvedVariation = resolvedPercent - prevResolvedPercent;

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
      variation: pendingVariation,
      trendColor: pendingVariation < 0 ? "text-green-500" : "text-red-500",
      trendIcon: pendingVariation < 0 ? TrendingDown : TrendingUp,
      trendWidth: `${Math.abs(pendingVariation)}%`,
      description: t('pendingRequestsDesc')
    },
    {
      title: t('resolvedRequests'),
      value: resolved,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40",
      variation: resolvedVariation,
      trendColor: resolvedVariation > 0 ? "text-green-500" : "text-red-500",
      trendIcon: resolvedVariation > 0 ? TrendingUp : TrendingDown,
      trendWidth: `${Math.abs(resolvedVariation)}%`,
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
                
                {metric.variation !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{metric.title === t('pendingRequests') ? pendingPercent : resolvedPercent}%</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className={`flex items-center gap-1 ${metric.trendColor}`}>
                            <metric.trendIcon className="h-3 w-3" />
                            <span className="font-semibold">{Math.abs(metric.variation)}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white/95 backdrop-blur-sm border-primary/10 p-3 shadow-lg animate-fade-in dark:bg-gray-800/95 dark:border-gray-700/50">
                          <p className="text-sm">{t('comparedToPreviousMonth')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart
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
  
  // Calcul des pourcentages et des variations
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
      progress: 100,
      progressColor: "bg-blue-500",
      description: t('totalRequestsDesc')
    },
    {
      title: t('pendingRequests'),
      value: pending,
      icon: Clock,
      color: "text-yellow-500",
      progress: pendingPercent,
      progressColor: "bg-yellow-500",
      variation: pendingVariation,
      description: t('pendingRequestsDesc')
    },
    {
      title: t('resolvedRequests'),
      value: resolved,
      icon: CheckCircle,
      color: "text-green-500",
      progress: resolvedPercent,
      progressColor: "bg-green-500",
      variation: resolvedVariation,
      description: t('resolvedRequestsDesc')
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={`absolute h-1 w-full top-0 ${metric.progressColor}`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                
                {metric.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{metric.progress}%</span>
                      {metric.variation !== undefined && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div className={`flex items-center gap-1 ${
                              metric.variation > 0 
                                ? metric.title === t('resolvedRequests') ? 'text-green-500' : 'text-red-500'
                                : metric.title === t('resolvedRequests') ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {(metric.variation > 0 && metric.title === t('resolvedRequests')) || 
                               (metric.variation < 0 && metric.title !== t('resolvedRequests')) ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span>{Math.abs(metric.variation)}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('comparedToPreviousMonth')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <Progress 
                      value={metric.progress} 
                      className={`h-1.5 transition-all duration-300 ${metric.progressColor}`}
                    />
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

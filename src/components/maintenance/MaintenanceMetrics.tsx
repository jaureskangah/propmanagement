
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Percent
} from "lucide-react";

interface MaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
}

export const MaintenanceMetrics = ({ total, pending, resolved }: MaintenanceMetricsProps) => {
  // Calculate percentages and variations (mock data for previous month)
  const pendingPercent = Math.round((pending / total) * 100) || 0;
  const resolvedPercent = Math.round((resolved / total) * 100) || 0;
  
  // Mock previous month data - in real application, this would come from props or API
  const prevPendingPercent = pendingPercent + 5; // Mock: 5% more pending last month
  const prevResolvedPercent = resolvedPercent - 5; // Mock: 5% less resolved last month
  
  const pendingVariation = pendingPercent - prevPendingPercent;
  const resolvedVariation = resolvedPercent - prevResolvedPercent;

  const metrics = [
    {
      title: "Total Requests",
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
      progress: 100,
      progressColor: "bg-blue-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-500",
      progress: pendingPercent,
      progressColor: "bg-yellow-500",
      variation: pendingVariation,
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-500",
      progress: resolvedPercent,
      progressColor: "bg-green-500",
      variation: resolvedVariation,
    },
  ];

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
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
                      <div className={`flex items-center gap-1 ${
                        metric.variation > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.variation > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(metric.variation)}%</span>
                      </div>
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
    </>
  );
};


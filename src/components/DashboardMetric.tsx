import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GripVertical } from "lucide-react";

interface DashboardMetricProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  trend?: "up" | "down";
  trendValue?: string;
  chartData?: Array<{ value: number }>;
  chartColor?: string;
  isLoading?: boolean;
  tooltip?: string;
}

export function DashboardMetric({ 
  title, 
  value, 
  icon, 
  description,
  className,
  trend,
  trendValue,
  chartData = [],
  chartColor = "#1E40AF",
  isLoading = false,
  tooltip
}: DashboardMetricProps) {
  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-[64px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const card = (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-grab active:cursor-grabbing",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-gradient-to-b before:from-primary before:to-blue-600 before:opacity-0 before:transition-opacity hover:before:opacity-100",
      "after:absolute after:inset-0 after:rounded-lg after:border-2 after:border-transparent after:transition-colors hover:after:border-primary/20",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in">
            {value}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground dark:text-gray-300 animate-fade-in">
              {description}
            </div>
          )}
          {chartData.length > 0 && (
            <div className="h-16 mt-3 transition-transform duration-300 group-hover:scale-[1.02]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md animate-fade-in">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="font-medium text-muted-foreground">Valeur:</span>
                              <span className="font-bold text-primary">
                                {typeof payload[0].value === 'number' 
                                  ? payload[0].value.toLocaleString()
                                  : payload[0].value}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    fill={`url(#gradient-${title})`}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1000}
                    className="transition-all duration-300 group-hover:opacity-90"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <UITooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {card}
          </TooltipTrigger>
          <TooltipContent 
            className="bg-white/95 backdrop-blur-sm border-primary/10 p-3 shadow-lg animate-fade-in"
            side="top"
            align="center"
          >
            <p className="text-sm text-gray-600">{tooltip}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  }

  return card;
}
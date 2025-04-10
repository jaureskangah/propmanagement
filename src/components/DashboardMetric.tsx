
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          </div>
        </CardContent>
      </Card>
    );
  }

  const card = (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg transform hover:-translate-y-1",
      "bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm",
      "border border-transparent hover:border-primary/20",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm transition-all duration-300 group-hover:scale-110 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in">
            {value}
          </div>
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
            className="bg-white/95 backdrop-blur-sm border-primary/10 p-3 shadow-lg animate-fade-in dark:bg-gray-800/95 dark:border-gray-700/50"
            side="top"
            align="center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">{tooltip}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  }

  return card;
}

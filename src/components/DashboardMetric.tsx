import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
  tooltip
}: DashboardMetricProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-gradient-to-b before:from-primary before:to-blue-600 before:opacity-0 before:transition-opacity hover:before:opacity-100",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-64"
                  side="bottom"
                  sideOffset={5}
                  align="start"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tooltip}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1">
            {value}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground">
              {description}
            </div>
          )}
          {chartData.length > 0 && (
            <div className="h-16 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    fill={`url(#gradient-${title})`}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
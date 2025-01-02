import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardMetricProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
  className?: string; // Added className prop to the interface
}

export function DashboardMetric({ 
  title, 
  value, 
  icon, 
  description,
  className 
}: DashboardMetricProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-gradient-to-b before:from-primary before:to-blue-600 before:opacity-0 before:transition-opacity hover:before:opacity-100",
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
        <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1">
          {value}
        </div>
        {description && (
          <div className="mt-2 text-xs opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
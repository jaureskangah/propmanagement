import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

export function DashboardMetric({ title, value, icon, description }: DashboardMetricProps) {
  return (
    <Card className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
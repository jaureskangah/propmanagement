
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ title, value, icon: Icon, iconColor = "text-muted-foreground" }: MetricCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm border border-transparent hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm transition-all duration-300 group-hover:scale-110 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in">{value}</div>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  color, 
  bgColor, 
  borderColor 
}: MetricCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
        `bg-gradient-to-br ${bgColor} ${borderColor}`
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              "bg-white/80 dark:bg-gray-800/50 shadow-sm",
              color
            )}>
              {icon}
            </div>
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors dark:text-gray-300">
              {title}
            </h3>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in dark:text-white">
            {value}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 dark:text-gray-400">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

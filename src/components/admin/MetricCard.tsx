
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderTrail } from "@/components/ui/border-trail";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ title, value, icon: Icon, iconColor = "text-muted-foreground" }: MetricCardProps) {
  return (
    <Card className="relative group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform bg-gradient-to-br from-card to-secondary/80 backdrop-blur-sm border border-transparent hover:border-primary/20">
      <BorderTrail
        className="bg-gradient-to-r from-primary via-blue-500 to-purple-500"
        size={50}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: "0px 0px 25px 12px rgb(30 64 175 / 15%)"
        }}
      />
      
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


import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";

interface MaintenanceChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const MaintenanceChartTooltip = ({ active, payload, label }: MaintenanceChartTooltipProps) => {
  const { t } = useLocale();
  
  if (active && payload && payload.length) {
    return (
      <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-md dark:bg-gray-800/95 py-1 px-0 min-w-[180px]">
        <CardContent className="p-3 space-y-2">
          <p className="text-xs font-semibold text-primary/90 pb-1 border-b border-border/30">{label}</p>
          
          <div className="space-y-1 text-xs">
            {payload.map((entry, index) => {
              let translatedLabel = entry.name;
              
              // Traduire les labels selon la clé
              switch (entry.dataKey) {
                case 'requests':
                  translatedLabel = t('requests');
                  break;
                case 'completed':
                  translatedLabel = t('completed');
                  break;
                case 'urgent':
                  translatedLabel = t('urgent');
                  break;
                case 'expenses':
                  translatedLabel = t('expenses');
                  break;
                default:
                  translatedLabel = entry.name;
              }
              
              const value = entry.dataKey === 'expenses' 
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toString();
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <div 
                      className="h-2.5 w-2.5 rounded-full mr-2" 
                      style={{ backgroundColor: entry.color }} 
                    />
                    {translatedLabel}:
                  </span>
                  <span className="font-medium" style={{ color: entry.color }}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

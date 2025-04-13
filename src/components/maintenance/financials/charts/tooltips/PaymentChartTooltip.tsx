
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const PaymentChartTooltip = ({ active, payload, label }: PaymentChartTooltipProps) => {
  const { t } = useLocale();
  
  if (active && payload && payload.length) {
    const paid = payload.find(p => p.dataKey === 'paid')?.value || 0;
    const pending = payload.find(p => p.dataKey === 'pending')?.value || 0;
    const late = payload.find(p => p.dataKey === 'late')?.value || 0;
    const cumulative = payload.find(p => p.dataKey === 'cumulative')?.value || 0;
    
    return (
      <Card className="border-border/40 bg-card/95 backdrop-blur-sm shadow-md dark:bg-gray-800/95 py-1 px-0 min-w-[180px]">
        <CardContent className="p-3 space-y-2">
          <p className="text-xs font-semibold text-primary/90 pb-1 border-b border-border/30">{label}</p>
          
          <div className="grid grid-cols-2 gap-y-1 text-xs">
            <span className="text-muted-foreground">{t('paid', { fallback: 'Paid' })}:</span>
            <span className="font-medium text-green-500">${paid.toLocaleString()}</span>
            
            <span className="text-muted-foreground">{t('pending', { fallback: 'Pending' })}:</span>
            <span className="font-medium text-yellow-500">${pending.toLocaleString()}</span>
            
            <span className="text-muted-foreground">{t('late', { fallback: 'Late' })}:</span>
            <span className="font-medium text-red-500">${late.toLocaleString()}</span>
            
            <span className="col-span-2 pt-1 mt-1 border-t border-border/30"></span>
            
            <span className="text-muted-foreground">{t('cumulativeTotal', { fallback: 'Cumulative' })}:</span>
            <span className="font-medium text-blue-500">${cumulative.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

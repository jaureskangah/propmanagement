
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialKPIProps {
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  icon: React.ReactNode;
  className?: string;
}

export default function FinancialKPI({ title, value, trend, icon, className }: FinancialKPIProps) {
  return (
    <Card className={cn("overflow-hidden border shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
          
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{value}</span>
              
              <div className="flex items-center mt-2">
                {trend.isPositive ? (
                  <span className="text-green-500 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {trend.value}
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    {trend.value}
                  </span>
                )}
                <span className="text-sm text-muted-foreground ml-1">{trend.label}</span>
              </div>
            </div>
            
            <div className={cn(
              "rounded-lg p-2",
              trend.isPositive ? "bg-green-100" : "bg-red-100"
            )}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

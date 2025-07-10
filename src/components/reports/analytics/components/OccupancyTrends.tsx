import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface OccupancyTrendsProps {
  tenants: any[];
  properties: any[];
}

export const OccupancyTrends = ({ tenants, properties }: OccupancyTrendsProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : undefined;

  // Generate last 12 months data
  const endDate = new Date();
  const startDate = startOfMonth(subMonths(endDate, 11));
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const occupancyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    // Count active tenants for this month
    const activeTenants = tenants.filter(tenant => {
      const leaseStart = new Date(tenant.lease_start);
      const leaseEnd = new Date(tenant.lease_end);
      return leaseStart <= monthEnd && leaseEnd >= monthStart;
    }).length;

    // Count available units in properties that existed at this time
    const availableUnits = properties.filter(property => {
      const createdAt = new Date(property.created_at);
      return createdAt <= monthEnd;
    }).reduce((total, property) => total + (property.units || 1), 0);

    const occupancyRate = availableUnits > 0 ? Math.round((activeTenants / availableUnits) * 100) : 0;

    return {
      month: format(month, 'MMM yyyy', { locale }),
      occupancyRate,
      activeTenants,
      totalUnits: availableUnits
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {t('occupancyTrends', { fallback: 'Tendances d\'Occupation' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={occupancyData}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'occupancyRate') {
                    return [`${value}%`, t('occupancyRate', { fallback: 'Taux d\'occupation' })];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => t('month', { fallback: 'Mois' }) + ': ' + label}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="occupancyRate" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {occupancyData[occupancyData.length - 1]?.occupancyRate || 0}%
            </p>
            <p className="text-sm text-muted-foreground">
              {t('currentOccupancy', { fallback: 'Occupation Actuelle' })}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {occupancyData[occupancyData.length - 1]?.activeTenants || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('activeTenants', { fallback: 'Locataires Actifs' })}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {occupancyData[occupancyData.length - 1]?.totalUnits || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('totalUnits', { fallback: 'Unités Totales' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
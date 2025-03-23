
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyChartStateProps {
  title?: string;
}

export const EmptyChartState = ({ title }: EmptyChartStateProps) => {
  const { t } = useLocale();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || t('maintenanceMetrics')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-64 text-muted-foreground">
        {t('noDataAvailable')}
      </CardContent>
    </Card>
  );
};

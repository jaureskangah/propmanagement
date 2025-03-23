
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingChartStateProps {
  title?: string;
}

export const LoadingChartState = ({ title }: LoadingChartStateProps) => {
  const { t } = useLocale();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || t('maintenanceMetrics')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

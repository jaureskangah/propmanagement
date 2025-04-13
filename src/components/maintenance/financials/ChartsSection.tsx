
import React from "react";
import { PaymentEvolutionChart } from "./charts/PaymentEvolutionChart";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartsSectionProps {
  propertyId: string;
}

export const ChartsSection = ({ propertyId }: ChartsSectionProps) => {
  const { t } = useLocale();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <PaymentEvolutionChart propertyId={propertyId} />
    </div>
  );
};

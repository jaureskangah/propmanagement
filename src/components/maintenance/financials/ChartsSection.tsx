
import React from "react";
import { PaymentEvolutionChart } from "./charts/PaymentEvolutionChart";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ChartsSectionProps {
  propertyId: string;
}

export const ChartsSection = ({ propertyId }: ChartsSectionProps) => {
  const { t } = useLocale();
  
  return <PaymentEvolutionChart propertyId={propertyId} />;
};

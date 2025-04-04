
import React from "react";
import { PaymentEvolutionChart } from "./charts/PaymentEvolutionChart";

interface ChartsSectionProps {
  propertyId: string;
}

export const ChartsSection = ({ propertyId }: ChartsSectionProps) => {
  return <PaymentEvolutionChart propertyId={propertyId} />;
};

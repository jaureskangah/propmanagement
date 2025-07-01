
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

interface NoPropertySelectedProps {
  type: "metrics" | "financial-overview" | "chart";
}

export const NoPropertySelected = ({ type }: NoPropertySelectedProps) => {
  const getMessage = () => {
    switch (type) {
      case "metrics":
        return "Sélectionnez une propriété pour voir les métriques financières";
      case "financial-overview":
        return "Sélectionnez une propriété pour voir l'aperçu financier";
      case "chart":
        return "Sélectionnez une propriété pour voir les graphiques";
      default:
        return "Sélectionnez une propriété pour voir les données";
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-48 text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{getMessage()}</p>
      </CardContent>
    </Card>
  );
};

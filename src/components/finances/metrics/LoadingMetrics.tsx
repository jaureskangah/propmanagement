
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialMetricSkeleton } from "./FinancialMetricCard";

export function LoadingMetrics() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <FinancialMetricSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

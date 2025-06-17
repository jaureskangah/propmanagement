
import React from "react";
import { RevenueChart } from "../RevenueChart";

export const DashboardRevenue = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Revenus</h2>
        <p className="text-muted-foreground">
          Analyse financière et évolution des revenus
        </p>
      </div>

      {/* Revenue Content */}
      <RevenueChart />
    </div>
  );
};


import React from "react";
import { RecentActivity } from "../RecentActivity";

export const DashboardActivities = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Activités récentes</h2>
        <p className="text-muted-foreground">
          Historique des actions et événements récents
        </p>
      </div>

      {/* Activities Content */}
      <RecentActivity />
    </div>
  );
};


import React from "react";
import { RecentActivity } from "../RecentActivity";
import { useLocale } from "@/components/providers/LocaleProvider";

export const DashboardActivities = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('activities')}</h2>
        <p className="text-muted-foreground">
          {t('activitiesDescription')}
        </p>
      </div>

      {/* Activities Content */}
      <RecentActivity />
    </div>
  );
};

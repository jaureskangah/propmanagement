
import React from "react";
import { RevenueChart } from "../RevenueChart";
import { useLocale } from "@/components/providers/LocaleProvider";

export const DashboardRevenue = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('revenue')}</h2>
        <p className="text-muted-foreground">
          {t('revenueDescription')}
        </p>
      </div>

      {/* Revenue Content */}
      <RevenueChart />
    </div>
  );
};

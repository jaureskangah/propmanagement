
import React from "react";
import { VendorList } from "../vendors/VendorList";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenanceVendorsSection = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('vendors')}</h2>
        <p className="text-muted-foreground">
          {t('manageVendorsAndInterventions')}
        </p>
      </div>

      {/* Vendors List */}
      <VendorList />
    </div>
  );
};

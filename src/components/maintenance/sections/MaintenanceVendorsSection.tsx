
import React from "react";
import { VendorList } from "../vendors/VendorList";

export const MaintenanceVendorsSection = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-semibold">Prestataires</h2>
        <p className="text-muted-foreground">
          Gérez vos prestataires et leurs interventions
        </p>
      </div>

      {/* Vendors List */}
      <VendorList />
    </div>
  );
};

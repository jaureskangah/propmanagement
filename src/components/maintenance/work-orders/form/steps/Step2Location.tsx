
import React from "react";
import { useWorkOrderForm } from "../WorkOrderFormContext";
import { PropertyUnitFields } from "../PropertyUnitFields";

export const Step2Location = () => {
  const { propertyId, setPropertyId, unit, setUnit } = useWorkOrderForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">Localisation</h3>
      <PropertyUnitFields
        propertyId={propertyId}
        setPropertyId={setPropertyId}
        unit={unit}
        setUnit={setUnit}
      />
    </div>
  );
};

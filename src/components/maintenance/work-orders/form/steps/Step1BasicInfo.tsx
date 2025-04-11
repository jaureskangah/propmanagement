
import React from "react";
import { useWorkOrderForm } from "../WorkOrderFormContext";
import { BasicInfoFields } from "../BasicInfoFields";

export const Step1BasicInfo = () => {
  const { title, setTitle, description, setDescription } = useWorkOrderForm();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">Informations de base</h3>
      <BasicInfoFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
    </div>
  );
};

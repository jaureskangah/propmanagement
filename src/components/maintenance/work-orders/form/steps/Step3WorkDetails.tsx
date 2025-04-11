
import React from "react";
import { useWorkOrderForm } from "../WorkOrderFormContext";
import { CostDateFields } from "../CostDateFields";
import { VendorStatusFields } from "../VendorStatusFields";
import { PhotoUpload } from "../PhotoUpload";
import { Separator } from "@/components/ui/separator";

export const Step3WorkDetails = () => {
  const { 
    cost, 
    setCost, 
    date, 
    setDate, 
    vendor,
    setVendor,
    status,
    setStatus,
    photos,
    setPhotos
  } = useWorkOrderForm();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">Détails du travail</h3>
      <CostDateFields
        cost={cost}
        setCost={setCost}
        date={date}
        setDate={setDate}
      />
      <VendorStatusFields
        vendor={vendor}
        setVendor={setVendor}
        status={status}
        setStatus={setStatus}
      />
      <Separator className="my-4" />
      <PhotoUpload
        handlePhotoChange={handlePhotoChange}
        photos={photos}
      />
    </div>
  );
};

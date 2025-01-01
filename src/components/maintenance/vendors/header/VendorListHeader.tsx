import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VendorListHeaderProps {
  onAddVendor: () => void;
}

export const VendorListHeader = ({ onAddVendor }: VendorListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Vendors</h2>
      <Button onClick={onAddVendor} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Vendor
      </Button>
    </div>
  );
};
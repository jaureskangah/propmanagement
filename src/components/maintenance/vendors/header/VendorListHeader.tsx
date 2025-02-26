
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorListHeaderProps {
  onAddVendor: () => void;
}

export const VendorListHeader = ({ onAddVendor }: VendorListHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{t('vendors')}</h2>
      <Button onClick={onAddVendor} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('addVendor')}
      </Button>
    </div>
  );
};

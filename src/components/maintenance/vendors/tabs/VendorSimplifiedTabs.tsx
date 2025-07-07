
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorMainList } from "../main/VendorMainList";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Vendor } from "@/types/vendor";

interface VendorSimplifiedTabsProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview: (vendor: { id: string; name: string }) => void;
}

export const VendorSimplifiedTabs = ({
  vendors,
  onEdit,
  onDelete,
  onReview
}: VendorSimplifiedTabsProps) => {
  const { t } = useLocale();

  return (
    <Tabs defaultValue="vendors" className="space-y-4">
      <TabsList>
        <TabsTrigger value="vendors">{t('vendors')}</TabsTrigger>
      </TabsList>

      <TabsContent value="vendors">
        <VendorMainList
          vendors={vendors}
          onEdit={onEdit}
          onDelete={onDelete}
          onReview={onReview}
        />
      </TabsContent>
    </Tabs>
  );
};

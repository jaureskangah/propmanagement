
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorMainList } from "../main/VendorMainList";
import { VendorReviewList } from "../reviews/VendorReviewList";
import { InterventionHistory } from "../interventions/InterventionHistory";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Vendor, VendorReview } from "@/types/vendor";

interface VendorSimplifiedTabsProps {
  vendors: Vendor[];
  reviews: VendorReview[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview: (vendor: { id: string; name: string }) => void;
  refetchReviews: () => void;
}

export const VendorSimplifiedTabs = ({
  vendors,
  reviews,
  onEdit,
  onDelete,
  onReview,
  refetchReviews
}: VendorSimplifiedTabsProps) => {
  const { t } = useLocale();

  return (
    <Tabs defaultValue="vendors" className="space-y-4">
      <TabsList>
        <TabsTrigger value="vendors">Prestataires</TabsTrigger>
        <TabsTrigger value="reviews">Évaluations</TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>

      <TabsContent value="vendors">
        <VendorMainList
          vendors={vendors}
          onEdit={onEdit}
          onDelete={onDelete}
          onReview={onReview}
        />
      </TabsContent>

      <TabsContent value="reviews">
        <VendorReviewList
          reviews={reviews}
          onRefresh={refetchReviews}
        />
      </TabsContent>

      <TabsContent value="history">
        <InterventionHistory />
      </TabsContent>
    </Tabs>
  );
};

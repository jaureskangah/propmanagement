import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VendorReview {
  id: string;
  vendor_id: string;
  comment: string;
  rating: number;
  quality_rating: number;
  price_rating: number;
  punctuality_rating: number;
  created_at: string;
}

interface VendorReviewListProps {
  reviews: VendorReview[];
}

export const VendorReviewList = ({ reviews }: VendorReviewListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {review.rating}/5
              </CardTitle>
              <span className="text-sm text-gray-500">
                {format(new Date(review.created_at), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="font-medium">Qualité</p>
                  <p>{review.quality_rating}/5</p>
                </div>
                <div>
                  <p className="font-medium">Prix</p>
                  <p>{review.price_rating}/5</p>
                </div>
                <div>
                  <p className="font-medium">Ponctualité</p>
                  <p>{review.punctuality_rating}/5</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
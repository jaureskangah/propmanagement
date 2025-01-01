import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface VendorReview {
  id: string;
  vendor_id: string;
  comment: string;
  rating: number;
  quality_rating: number;
  price_rating: number;
  punctuality_rating: number;
  created_at: string;
  user_id: string;
}

interface VendorReviewListProps {
  reviews: VendorReview[];
  onEdit: (review: VendorReview) => void;
  onRefresh: () => void;
}

export const VendorReviewList = ({ reviews, onEdit, onRefresh }: VendorReviewListProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDelete = async (review: VendorReview) => {
    try {
      const { error } = await supabase
        .from('vendor_reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;

      toast({
        title: "Évaluation supprimée",
        description: "L'évaluation a été supprimée avec succès.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'évaluation.",
        variant: "destructive",
      });
    }
  };

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
              {user?.id === review.user_id && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(review)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
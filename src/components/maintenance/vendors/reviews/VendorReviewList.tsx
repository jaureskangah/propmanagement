
import React, { useState } from "react";
import { VendorReview } from "@/types/vendor";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Pencil, Trash2 } from "lucide-react";
import { VendorReviewDialog } from "./VendorReviewDialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQueryClient } from "@tanstack/react-query";

interface VendorReviewListProps {
  reviews: VendorReview[];
  onRefresh: () => void;
}

export const VendorReviewList: React.FC<VendorReviewListProps> = ({ reviews, onRefresh }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, language } = useLocale();
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<VendorReview | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleDelete = async (review: VendorReview) => {
    try {
      toast({
        title: t('deleteInProgress'),
        description: t('processingRequest'),
      });

      const { error } = await supabase
        .from('vendor_reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;

      toast({
        title: t('reviewDeleted'),
        description: t('reviewDeletedSuccess'),
      });
      
      // Invalider les caches pour rafraîchir les données des prestataires
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
      await queryClient.invalidateQueries({ queryKey: ['vendor_reviews'] });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: t('error'),
        description: t('errorDeletingReview'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: VendorReview) => {
    setEditingReview(review);
    setReviewDialogOpen(true);
  };

  const handleEditSuccess = async () => {
    setReviewDialogOpen(false);
    setEditingReview(null);
    // Invalider les caches pour rafraîchir les données des prestataires
    await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    onRefresh();
  };

  return (
    <>
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
                  {format(
                    new Date(review.created_at), 
                    "MMMM d, yyyy", 
                    { locale: language === 'fr' ? fr : enUS }
                  )}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="font-medium">{t('quality')}</p>
                    <p>{review.quality_rating}/5</p>
                  </div>
                  <div>
                    <p className="font-medium">{t('price')}</p>
                    <p>{review.price_rating}/5</p>
                  </div>
                  <div>
                    <p className="font-medium">{t('punctuality')}</p>
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
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      {t('modify')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(review)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('delete')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingReview && (
        <VendorReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          vendorId={editingReview.vendor_id}
          initialData={editingReview}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

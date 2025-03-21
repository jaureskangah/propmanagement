import React from "react";
import { VendorReview } from "@/types/vendor";

interface VendorReviewListProps {
  reviews: VendorReview[];
  onRefresh: () => void;
}

export const VendorReviewList: React.FC<VendorReviewListProps> = ({ reviews, onRefresh }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<VendorReview | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleDelete = async (review: VendorReview) => {
    try {
      toast({
        title: "Suppression en cours",
        description: "Traitement de votre demande...",
      });

      const { error } = await supabase
        .from('vendor_reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;

      toast({
        title: "Avis supprimé",
        description: "L'avis a été supprimé avec succès.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'avis.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: VendorReview) => {
    setEditingReview(review);
    setReviewDialogOpen(true);
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
                  {format(new Date(review.created_at), "MMMM d, yyyy", { locale: enUS })}
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
                      onClick={() => handleEdit(review)}
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

      {editingReview && (
        <VendorReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          vendorId={editingReview.vendor_id}
          initialData={editingReview}
          onSuccess={() => {
            setReviewDialogOpen(false);
            setEditingReview(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
};


import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { VendorReview } from "@/types/vendor";
import { RatingFields } from "./form/RatingFields";
import { CommentField } from "./form/CommentField";
import { FormActions } from "./form/FormActions";

interface VendorReviewFormProps {
  vendorId: string;
  initialData?: VendorReview;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VendorReviewForm = ({ 
  vendorId, 
  initialData, 
  onSuccess, 
  onCancel 
}: VendorReviewFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      comment: initialData?.comment || "",
      qualityRating: initialData?.quality_rating || 3,
      priceRating: initialData?.price_rating || 3,
      punctualityRating: initialData?.punctuality_rating || 3,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (!user?.id) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour soumettre un avis.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      const reviewData = {
        vendor_id: vendorId,
        comment: data.comment,
        quality_rating: data.qualityRating,
        price_rating: data.priceRating,
        punctuality_rating: data.punctualityRating,
        user_id: user.id,
        rating: 0, // Calculé par le trigger de la base de données
      };

      if (initialData) {
        const { error } = await supabase
          .from("vendor_reviews")
          .update(reviewData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Avis mis à jour",
          description: "Votre avis a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from("vendor_reviews")
          .insert(reviewData);

        if (error) throw error;

        toast({
          title: "Avis ajouté",
          description: "Votre avis a été soumis avec succès.",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'avis.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RatingFields form={form} />
        <CommentField form={form} />
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!initialData}
        />
      </form>
    </Form>
  );
};

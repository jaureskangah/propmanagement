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
        throw new Error("User not authenticated");
      }

      setIsSubmitting(true);
      const reviewData = {
        vendor_id: vendorId,
        comment: data.comment,
        quality_rating: data.qualityRating,
        price_rating: data.priceRating,
        punctuality_rating: data.punctualityRating,
        user_id: user.id,
        rating: 0, // This will be calculated by the database trigger
      };

      if (initialData) {
        const { error } = await supabase
          .from("vendor_reviews")
          .update(reviewData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Review updated",
          description: "Your review has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("vendor_reviews")
          .insert(reviewData);

        if (error) throw error;

        toast({
          title: "Review added",
          description: "Your review has been submitted successfully.",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the review.",
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
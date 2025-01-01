import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { VendorReview } from "@/types/vendor";

interface VendorReviewFormProps {
  vendorId: string;
  initialData?: VendorReview;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ReviewFormValues {
  comment: string;
  qualityRating: number;
  priceRating: number;
  punctualityRating: number;
}

export const VendorReviewForm = ({ 
  vendorId, 
  initialData, 
  onSuccess, 
  onCancel 
}: VendorReviewFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: initialData?.comment || "",
      qualityRating: initialData?.quality_rating || 3,
      priceRating: initialData?.price_rating || 3,
      punctualityRating: initialData?.punctuality_rating || 3,
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

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
        // Update existing review
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
        // Insert new review
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
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="qualityRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Quality</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-48"
                  />
                  <span className="w-8 text-center">{field.value}/5</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value for Money</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-48"
                  />
                  <span className="w-8 text-center">{field.value}/5</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="punctualityRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Punctuality</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-48"
                  />
                  <span className="w-8 text-center">{field.value}/5</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this vendor..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Submit"} Review
          </Button>
        </div>
      </form>
    </Form>
  );
};
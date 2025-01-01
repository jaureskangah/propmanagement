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

interface VendorReviewFormProps {
  vendorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ReviewFormValues {
  comment: string;
  qualityRating: number;
  priceRating: number;
  punctualityRating: number;
}

export const VendorReviewForm = ({ vendorId, onSuccess, onCancel }: VendorReviewFormProps) => {
  const { toast } = useToast();
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      comment: "",
      qualityRating: 3,
      priceRating: 3,
      punctualityRating: 3,
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      const { error } = await supabase.from("vendor_reviews").insert({
        vendor_id: vendorId,
        comment: data.comment,
        quality_rating: data.qualityRating,
        price_rating: data.priceRating,
        punctuality_rating: data.punctualityRating,
      });

      if (error) throw error;

      toast({
        title: "Évaluation ajoutée",
        description: "Votre évaluation a été enregistrée avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'évaluation.",
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
              <FormLabel>Qualité du travail</FormLabel>
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
              <FormLabel>Rapport qualité/prix</FormLabel>
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
              <FormLabel>Ponctualité</FormLabel>
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
              <FormLabel>Commentaire détaillé</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Partagez votre expérience avec ce prestataire..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Envoyer l'évaluation
          </Button>
        </div>
      </form>
    </Form>
  );
};
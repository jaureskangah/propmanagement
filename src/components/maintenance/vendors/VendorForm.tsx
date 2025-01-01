import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@supabase/auth-helpers-react";

const vendorFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  specialty: z.string().min(2, "La spécialité doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  email: z.string().email("Email invalide"),
  emergency_contact: z.boolean().default(false),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface VendorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: Partial<VendorFormValues>;
}

export const VendorForm = ({ onSuccess, onCancel, defaultValues }: VendorFormProps) => {
  const { toast } = useToast();
  const auth = useAuth();
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: defaultValues || {
      name: "",
      specialty: "",
      phone: "",
      email: "",
      emergency_contact: false,
    },
  });

  const onSubmit = async (data: VendorFormValues) => {
    if (!auth?.user?.id) {
      toast({ 
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    try {
      if (defaultValues?.name) {
        // Update
        const { error } = await supabase
          .from("vendors")
          .update({ ...data, user_id: auth.user.id })
          .eq("name", defaultValues.name);
        
        if (error) throw error;
        toast({ title: "Prestataire mis à jour avec succès" });
      } else {
        // Create
        const { error } = await supabase
          .from("vendors")
          .insert([{ ...data, user_id: auth.user.id }]);
        
        if (error) throw error;
        toast({ title: "Prestataire ajouté avec succès" });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast({ 
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécialité</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergency_contact"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Contact d'urgence</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {defaultValues ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
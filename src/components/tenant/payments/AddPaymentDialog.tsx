import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const paymentSchema = z.object({
  amount: z.string().min(1, "Le montant est requis"),
  status: z.string().min(1, "Le statut est requis"),
  payment_date: z.string().min(1, "La date est requise"),
});

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  onPaymentAdded: () => void;
}

export const AddPaymentDialog = ({
  open,
  onOpenChange,
  tenantId,
  onPaymentAdded,
}: AddPaymentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      status: "payé",
      payment_date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    console.log("Submitting payment:", values);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("tenant_payments").insert({
        tenant_id: tenantId,
        amount: parseFloat(values.amount),
        status: values.status,
        payment_date: values.payment_date,
      });

      if (error) throw error;

      toast({
        title: "Paiement ajouté",
        description: "Le paiement a été enregistré avec succès.",
      });
      
      onPaymentAdded();
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un paiement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="payé">Payé</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="en retard">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de paiement</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ea384c] hover:bg-[#ea384c]/90"
              >
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
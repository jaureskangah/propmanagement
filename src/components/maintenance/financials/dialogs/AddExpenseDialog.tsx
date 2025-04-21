
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export const AddExpenseDialog = ({ isOpen, onClose, propertyId }: AddExpenseDialogProps) => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      const { error } = await supabase
        .from("maintenance_expenses")
        .insert({
          property_id: propertyId,
          category: form.category,
          amount: parseFloat(form.amount),
          date: form.date,
          description: form.description,
          user_id: null // à remplacer par l'utilisateur s'il existe
        });
      setLoading(false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId] });
      onClose();
      setForm({ category: "", amount: "", date: "", description: "" });
    },
    onError: (err: any) => {
      setError(err.message || "Erreur lors de l'ajout du coût.");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addExpense', { fallback: "Ajouter un coût" })}</DialogTitle>
          <DialogDescription>
            {t('fillExpenseDetails', { fallback: "Renseignez les informations du coût." })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">{t('category', { fallback: "Catégorie" })}</Label>
            <Input
              id="category"
              required
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder={t('category', { fallback: "Catégorie" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount', { fallback: "Montant" })}</Label>
            <Input
              id="amount"
              required
              name="amount"
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder={t('amount', { fallback: "Montant" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t('date', { fallback: "Date" })}</Label>
            <Input
              id="date"
              required
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description', { fallback: "Description" })}</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t('description', { fallback: "Description (optionnelle)" })}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('cancel', { fallback: "Annuler" })}</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('saving', { fallback: "Enregistrement..." }) : t('save', { fallback: "Enregistrer" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

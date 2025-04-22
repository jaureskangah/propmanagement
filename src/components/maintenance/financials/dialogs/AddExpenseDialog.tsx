
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export const AddExpenseDialog = ({ isOpen, onClose, propertyId }: AddExpenseDialogProps) => {
  const { t, language } = useLocale();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
    vendor_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des fournisseurs
  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data || [];
    }
  });

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      // Récupérer l'ID de l'utilisateur authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour ajouter une dépense");
      }
      
      const { error } = await supabase
        .from("maintenance_expenses")
        .insert({
          property_id: propertyId,
          category: form.category,
          amount: parseFloat(form.amount),
          date: form.date,
          description: form.description,
          vendor_id: form.vendor_id || null,
          user_id: user.id
        });
      setLoading(false);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalider plusieurs requêtes pour mettre à jour les données partout
      queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["maintenance_expenses"] });
      queryClient.invalidateQueries({ queryKey: ["financial_metrics"] });
      onClose();
      setForm({ category: "", amount: "", date: "", description: "", vendor_id: "" });
    },
    onError: (err: any) => {
      console.error("Erreur lors de l'ajout de la dépense:", err);
      setError(err.message || "Erreur lors de l'ajout de la dépense.");
      setLoading(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.amount || !form.date) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'fr' ? "Ajouter une dépense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            {language === 'fr' ? "Renseignez les informations de la dépense." : "Fill expense details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">{language === 'fr' ? "Catégorie" : "Category"}</Label>
            <Input
              id="category"
              required
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder={language === 'fr' ? "Catégorie" : "Category"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{language === 'fr' ? "Montant" : "Amount"}</Label>
            <Input
              id="amount"
              required
              name="amount"
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder={language === 'fr' ? "Montant" : "Amount"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{language === 'fr' ? "Date" : "Date"}</Label>
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
            <Label htmlFor="vendor_id">{language === 'fr' ? "Fournisseur (optionnel)" : "Vendor (optional)"}</Label>
            <Select 
              value={form.vendor_id} 
              onValueChange={(value) => handleSelectChange("vendor_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'fr' ? "Sélectionner un fournisseur" : "Select a vendor"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {language === 'fr' ? "Aucun fournisseur" : "No vendor"}
                </SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{language === 'fr' ? "Description" : "Description"}</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={language === 'fr' ? "Description (optionnelle)" : "Description (optional)"}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {language === 'fr' ? "Annuler" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading 
              ? (language === 'fr' ? "Enregistrement..." : "Saving...") 
              : (language === 'fr' ? "Enregistrer" : "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

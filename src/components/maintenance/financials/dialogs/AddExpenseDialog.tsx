import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess?: () => void;
}

export const AddExpenseDialog = ({ isOpen, onClose, propertyId, onSuccess }: AddExpenseDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    vendor_id: ""
  });

  console.log("AddExpenseDialog rendu avec propertyId:", propertyId);

  // Fetch vendors for the dropdown
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

  const expenseCategories = [
    "Plomberie",
    "Électricité", 
    "Chauffage/Climatisation",
    "Peinture",
    "Nettoyage",
    "Jardinage",
    "Réparations générales",
    "Matériaux",
    "Autre"
  ];

  const validateForm = () => {
    if (!date) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.category) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir un montant valide",
        variant: "destructive",
      });
      return false;
    }

    if (!propertyId) {
      toast({
        title: "Erreur de validation",
        description: "Propriété non sélectionnée",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Récupérer l'utilisateur actuel
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Utilisateur non authentifié");
      }

      const expenseData = {
        property_id: propertyId,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        date: date!.toISOString().split('T')[0],
        vendor_id: formData.vendor_id === "none" || !formData.vendor_id ? null : formData.vendor_id,
        user_id: userData.user.id
      };

      console.log("Insertion de la dépense avec les données:", expenseData);

      const { data, error } = await supabase
        .from("maintenance_expenses")
        .insert(expenseData)
        .select();

      if (error) {
        console.error("Erreur lors de l'insertion:", error);
        throw error;
      }

      console.log("Dépense ajoutée avec succès:", data);

      // Invalider plusieurs queries pour rafraîchir les données
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["maintenance_expenses"] }),
        queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["all_expenses", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["vendor_interventions", propertyId] }),
      ]);

      toast({
        title: "Succès",
        description: "Dépense ajoutée avec succès",
      });

      // Reset form
      setFormData({
        category: "",
        amount: "",
        description: "",
        vendor_id: ""
      });
      setDate(undefined);
      
      // Fermer le dialogue et appeler onSuccess
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la dépense",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (CAD) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Fournisseur (optionnel)</Label>
            <Select
              value={formData.vendor_id}
              onValueChange={(value) => handleInputChange("vendor_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun fournisseur</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de la dépense..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

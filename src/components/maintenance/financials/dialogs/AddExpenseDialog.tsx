
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSuccess?: () => void;
}

export const AddExpenseDialog = ({ isOpen, onClose, propertyId, onSuccess }: AddExpenseDialogProps) => {
  const { t, language } = useLocale();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const locale = language === 'fr' ? fr : enUS;
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: "",
    date: new Date(),
    status: "pending",
    unit_number: "",
    property_id: propertyId,
    vendor_id: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: units = [] } = useQuery({
    queryKey: ["units", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      const { data, error } = await supabase
        .from("tenants")
        .select("unit_number")
        .eq("property_id", propertyId)
        .order("unit_number");
      
      if (error) throw error;
      const uniqueUnits = Array.from(new Set((data || []).map(d => d.unit_number)));
      return uniqueUnits;
    },
    enabled: !!propertyId
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name");
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, name, specialty");
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: "",
        description: "",
        cost: "",
        date: new Date(),
        status: "pending",
        unit_number: "",
        property_id: propertyId,
        vendor_id: ""
      });
      setError(null);
    }
  }, [isOpen, propertyId]);

  const mutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error(language === 'fr' ? "Vous devez être connecté pour ajouter une intervention" : "You must be logged in to add a maintenance");
      }
      
      // Formatage direct YYYY-MM-DD sans conversion de timezone
      const day = String(form.date.getDate()).padStart(2, '0');
      const month = String(form.date.getMonth() + 1).padStart(2, '0');
      const year = form.date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log("--- DIAGNOSTIC DE LA DATE ---");
      console.log("Date actuelle:", new Date().toISOString());
      console.log("Objet date sélectionné:", form.date);
      console.log("Date YYYY-MM-DD formatée:", formattedDate);
      console.log("Date locale affichée:", format(form.date, 'PPP', { locale }));
      console.log("Jour:", form.date.getDate(), "Mois:", form.date.getMonth() + 1, "Année:", form.date.getFullYear());
      console.log("--------------------------");
      
      const maintenanceData = {
        title: form.title,
        description: form.description,
        cost: parseFloat(form.cost),
        date: formattedDate, // Date formatée directement
        status: form.status,
        unit_number: form.unit_number === "none" ? null : form.unit_number,
        property_id: form.property_id,
        vendor_id: form.vendor_id === "no_vendor" ? null : form.vendor_id,
        user_id: user.id
      };
      
      console.log("Données d'intervention soumises:", maintenanceData);
      
      const { error } = await supabase
        .from("vendor_interventions")
        .insert(maintenanceData);
        
      setLoading(false);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: language === 'fr' ? "Intervention ajoutée" : "Maintenance added",
        description: language === 'fr' ? "L'intervention a été ajoutée avec succès" : "The maintenance has been successfully added",
      });

      queryClient.invalidateQueries({ queryKey: ["vendor_interventions"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance_expenses"] });
      queryClient.invalidateQueries({ queryKey: ["financial_expenses"] });
      queryClient.invalidateQueries({ queryKey: ["financial_chart_data"] });
      queryClient.invalidateQueries({ queryKey: ["financial_metrics"] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    },
    onError: (err: any) => {
      console.error("Erreur lors de l'ajout de l'intervention:", err);
      setError(err.message || (language === 'fr' ? "Erreur lors de l'ajout de l'intervention." : "Error adding maintenance."));
      setLoading(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Garder la date exactement telle qu'elle est sélectionnée
      console.log("Date sélectionnée dans le calendrier:", date);
      console.log("Date au format local:", format(date, 'PPP', { locale }));
      console.log("Date au format ISO:", date.toISOString());
      console.log("Jour:", date.getDate(), "Mois:", date.getMonth() + 1, "Année:", date.getFullYear());
      
      setForm(prev => ({ ...prev, date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.cost || !form.date) {
      setError(language === 'fr' ? "Veuillez remplir tous les champs obligatoires" : "Please fill in all required fields");
      return;
    }
    
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{language === 'fr' ? "Ajouter une intervention" : "Add Maintenance"}</DialogTitle>
          <DialogDescription>
            {language === 'fr' ? "Renseignez les informations de l'intervention." : "Fill maintenance details."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{language === 'fr' ? "Titre" : "Title"}</Label>
              <Input
                id="title"
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder={language === 'fr' ? "Titre de l'intervention" : "Maintenance title"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_id">{language === 'fr' ? "Propriété" : "Property"}</Label>
              <Select 
                value={form.property_id} 
                onValueChange={(value) => handleSelectChange("property_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'fr' ? "Sélectionner une propriété" : "Select a property"} />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor_id">{language === 'fr' ? "Prestataire" : "Vendor"}</Label>
              <Select 
                value={form.vendor_id} 
                onValueChange={(value) => handleSelectChange("vendor_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'fr' ? "Sélectionner un prestataire" : "Select a vendor"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_vendor">
                    {language === 'fr' ? "Aucun prestataire" : "No vendor"}
                  </SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">{language === 'fr' ? "Coût" : "Cost"}</Label>
              <Input
                id="cost"
                required
                name="cost"
                type="number"
                min={0}
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                placeholder={language === 'fr' ? "Coût" : "Cost"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{language === 'fr' ? "Date" : "Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.date ? format(form.date, "PPP", { locale }) : (
                      <span>{language === 'fr' ? "Sélectionner une date" : "Select a date"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={locale}
                    className="pointer-events-auto"
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_number">{language === 'fr' ? "Unité (optionnel)" : "Unit (optional)"}</Label>
              <Select 
                value={form.unit_number} 
                onValueChange={(value) => handleSelectChange("unit_number", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'fr' ? "Sélectionner une unité" : "Select a unit"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {language === 'fr' ? "Aucune unité" : "No unit"}
                  </SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{language === 'fr' ? "Statut" : "Status"}</Label>
              <Select 
                value={form.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'fr' ? "Sélectionner un statut" : "Select a status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{language === 'fr' ? "En attente" : "Pending"}</SelectItem>
                  <SelectItem value="in_progress">{language === 'fr' ? "En cours" : "In Progress"}</SelectItem>
                  <SelectItem value="completed">{language === 'fr' ? "Terminé" : "Completed"}</SelectItem>
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
                placeholder={language === 'fr' ? "Description de l'intervention" : "Maintenance description"}
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
        </ScrollArea>
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

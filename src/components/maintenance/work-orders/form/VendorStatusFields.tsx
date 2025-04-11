
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Users, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorStatusFieldsProps {
  vendor: string;
  setVendor: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export const VendorStatusFields = ({
  vendor,
  setVendor,
  status,
  setStatus,
}: VendorStatusFieldsProps) => {
  const { language } = useLocale();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      console.log("Fetching vendors...");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('vendors')
        .select('id, name')
        .eq('user_id', userData.user.id)
        .order('name');
      
      if (error) {
        console.error("Error fetching vendors:", error);
        throw error;
      }
      
      console.log("Fetched vendors:", data);
      return data;
    },
  });

  // Filter out invalid vendors - those with null/undefined/empty id or name
  const filteredVendors = vendors.filter(v => v && v.id && v.id.trim() !== "" && v.name && v.name.trim() !== "");

  // Traduire les libellés des statuts pour l'affichage
  const getStatusLabel = (statusValue: string) => {
    if (language === 'fr') {
      switch (statusValue) {
        case "Scheduled": return "Planifié";
        case "In Progress": return "En cours";
        case "Completed": return "Terminé";
        default: return statusValue;
      }
    }
    return statusValue;
  };

  // Traduire les valeurs françaises en valeurs anglaises pour le stockage
  const handleStatusChange = (value: string) => {
    // Si la langue est française, convertir les valeurs françaises en anglais pour le stockage
    if (language === 'fr') {
      switch (value) {
        case "Planifié": setStatus("Scheduled"); return;
        case "En cours": setStatus("In Progress"); return;
        case "Terminé": setStatus("Completed"); return;
        default: setStatus(value); return;
      }
    }
    setStatus(value);
  };

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center text-base font-medium">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Prestataire
            </Label>
            <Select value={vendor} onValueChange={setVendor}>
              <SelectTrigger className={isLoading ? "animate-pulse" : ""}>
                <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un prestataire"} />
              </SelectTrigger>
              <SelectContent>
                {filteredVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center text-base font-medium">
              <Activity className="h-4 w-4 mr-2 text-blue-500" />
              Statut
            </Label>
            <Select 
              value={language === 'fr' ? getStatusLabel(status) : status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {language === 'fr' ? (
                  <>
                    <SelectItem value="Planifié">Planifié</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

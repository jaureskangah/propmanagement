
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Users, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Planifié</SelectItem>
                <SelectItem value="In Progress">En cours</SelectItem>
                <SelectItem value="Completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

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

  // Filtrer les fournisseurs pour éliminer les valeurs potentiellement problématiques
  const filteredVendors = vendors.filter(vendor => vendor && vendor.id && vendor.id.trim() !== "");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Vendor</Label>
        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading..." : "Select a vendor"} />
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
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

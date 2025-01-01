import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Prestataire</Label>
        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un prestataire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">John's Plumbing</SelectItem>
            <SelectItem value="2">Cool Air Services</SelectItem>
            <SelectItem value="3">Electric Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planifié">Planifié</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
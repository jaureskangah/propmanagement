import React from "react";
import { EmergencyContactCard } from "./EmergencyContactCard";
import { Vendor } from "@/types/vendor";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmergencyContactListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const EmergencyContactList = ({ vendors }: EmergencyContactListProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.phone.includes(searchQuery)
  );

  const handleCall = (phone: string) => {
    // Sur mobile, on peut utiliser le protocole tel:
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phone}`;
    } else {
      // Sur desktop, on copie le numéro dans le presse-papier
      navigator.clipboard.writeText(phone);
      toast({
        title: "Numéro copié !",
        description: `Le numéro ${phone} a été copié dans le presse-papier.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un contact d'urgence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => (
          <EmergencyContactCard
            key={vendor.id}
            vendor={vendor}
            onCall={handleCall}
          />
        ))}
      </div>
    </div>
  );
};
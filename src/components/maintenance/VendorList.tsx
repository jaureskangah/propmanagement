import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

// Types
interface Vendor {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  rating: number;
}

interface VendorListProps {
  vendors: Vendor[];
  onAddVendor: () => void;
}

export const VendorList = ({ vendors, onAddVendor }: VendorListProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prestataires</h2>
        <Button onClick={onAddVendor} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Prestataire
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Spécialité:</strong> {vendor.specialty}</p>
                <p><strong>Téléphone:</strong> {vendor.phone}</p>
                <p><strong>Email:</strong> {vendor.email}</p>
                <p><strong>Note:</strong> {vendor.rating}/5</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
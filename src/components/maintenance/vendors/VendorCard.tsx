import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vendor } from "@/types/vendor";

interface VendorCardProps {
  vendor: Vendor;
  isEmergencyView?: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, isEmergencyView, onEdit, onDelete }: VendorCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{vendor.name}</CardTitle>
          {isEmergencyView ? (
            <Phone className="h-5 w-5 text-red-500" />
          ) : (
            <Users className="h-5 w-5 text-blue-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Spécialité:</strong> {vendor.specialty}</p>
          <p><strong>Téléphone:</strong> {vendor.phone}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Note:</strong> {vendor.rating}/5</p>
          {vendor.emergency_contact && (
            <p className="text-red-500 font-semibold">Contact d'urgence</p>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(vendor)}>
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(vendor)}>
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
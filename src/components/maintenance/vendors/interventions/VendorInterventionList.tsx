import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { VendorIntervention, Vendor } from "@/types/vendor";

interface VendorInterventionListProps {
  interventions: VendorIntervention[];
  vendors: Vendor[];
}

export const VendorInterventionList = ({ interventions, vendors }: VendorInterventionListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interventions.map((intervention) => {
        const vendor = vendors.find(v => v.id === intervention.vendor_id);
        return (
          <Card key={intervention.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vendor?.name}</CardTitle>
                <History className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Titre:</strong> {intervention.title}</p>
                <p><strong>Description:</strong> {intervention.description}</p>
                <p><strong>Date:</strong> {new Date(intervention.date).toLocaleDateString()}</p>
                <p><strong>Coût:</strong> {intervention.cost}€</p>
                <p><strong>Statut:</strong> {intervention.status}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
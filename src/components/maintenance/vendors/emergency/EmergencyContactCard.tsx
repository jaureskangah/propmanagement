import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Star } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";

interface EmergencyContactCardProps {
  vendor: Vendor;
  onCall: (phone: string) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const EmergencyContactCard = ({ vendor, onCall, onEdit, onDelete }: EmergencyContactCardProps) => {
  // Simulate real-time availability (to be replaced with real logic)
  const isAvailable = Math.random() > 0.3;

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {vendor.name}
            <Badge variant={isAvailable ? "default" : "destructive"} className={isAvailable ? "bg-green-500 hover:bg-green-600" : ""}>
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </CardTitle>
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Specialty</p>
            <p className="font-medium">{vendor.specialty}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Average rating</p>
            <p className="font-medium">{vendor.rating}/5</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Contact</p>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => onCall(vendor.phone)}
            >
              <Phone className="h-4 w-4 mr-2" />
              {vendor.phone}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(vendor)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete(vendor)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
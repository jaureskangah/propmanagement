
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Clock, Star, MapPin } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EmergencyContactCardProps {
  vendor: Vendor;
  onCall: (phone: string) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const EmergencyContactCard = ({ vendor, onCall, onEdit, onDelete }: EmergencyContactCardProps) => {
  const { t } = useLocale();
  // Simulate real-time availability (to be replaced with real logic)
  const isAvailable = Math.random() > 0.3;
  
  return (
    <Card className="relative border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 right-0 p-2">
        <Badge variant={isAvailable ? "default" : "outline"} 
              className={`${isAvailable ? "animate-pulse bg-green-500 hover:bg-green-600" : "bg-gray-100 text-gray-600"}`}>
          {isAvailable ? t('available') : t('unavailable')}
        </Badge>
      </div>
      
      <CardHeader className="pb-2 bg-red-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {vendor.name}
          </CardTitle>
          <Star className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <div className="font-medium">{vendor.specialty}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{t('rating')}</div>
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
              <span className="font-medium">{vendor.rating.toFixed(1)}/5</span>
            </div>
          </div>

          <Button 
            variant="default" 
            className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
            onClick={() => onCall(vendor.phone)}
          >
            <Phone className="h-4 w-4" />
            {vendor.phone}
          </Button>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-200"
              onClick={() => onEdit(vendor)}
            >
              {t('edit')}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete(vendor)}
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

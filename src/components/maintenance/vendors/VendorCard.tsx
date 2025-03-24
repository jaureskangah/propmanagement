
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, Image, FileText, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vendor } from "@/types/vendor";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorCardProps {
  vendor: Vendor;
  isEmergencyView?: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview?: () => void;
}

export const VendorCard = ({ 
  vendor, 
  isEmergencyView, 
  onEdit, 
  onDelete,
  onReview
}: VendorCardProps) => {
  const { t } = useLocale();
  
  // Données simulées pour la disponibilité
  const isAvailableNow = vendor.id.charAt(0) <= 'c'; // Juste une simulation basée sur l'ID
  const nextAvailability = isAvailableNow 
    ? 'Disponible maintenant'
    : `Disponible ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][Math.floor(Math.random() * 5)]}`;
  
  // Fetch vendor documents
  const { data: documents = [] } = useQuery({
    queryKey: ['vendor_documents', vendor.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_documents')
        .select('*')
        .eq('vendor_id', vendor.id);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{vendor.name}</CardTitle>
          {isEmergencyView ? (
            <Phone className="h-5 w-5 text-red-500" />
          ) : (
            <Users className="h-5 w-5 text-blue-500" />
          )}
        </div>
        <div className="flex items-center mt-1">
          <Rating value={vendor.rating} onChange={() => {}} max={5} readonly={true} />
          <span className="ml-1 text-sm text-muted-foreground">
            {vendor.rating.toFixed(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm"><strong>{t('specialty')}:</strong> {vendor.specialty}</p>
          <p className="text-sm"><strong>{t('phone')}:</strong> {vendor.phone}</p>
          
          <div className="flex items-center gap-1 mt-2">
            {isAvailableNow ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />
                {t('availableNow')}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <Calendar className="h-3 w-3 mr-1" />
                {nextAvailability}
              </Badge>
            )}
            
            {vendor.emergency_contact && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {t('emergency')}
              </Badge>
            )}
          </div>
          
          {vendor.photos && vendor.photos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Image className="h-4 w-4" />
                {t('photos')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {vendor.photos.slice(0, 2).map((photo, index) => (
                  <AspectRatio key={index} ratio={16 / 9}>
                    <img
                      src={photo}
                      alt={`${vendor.name} - Photo ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('documents')}
              </p>
              <div className="space-y-2">
                {documents.slice(0, 2).map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4" />
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(vendor)}>
              {t('edit')}
            </Button>
            {onReview && (
              <Button variant="outline" size="sm" onClick={onReview}>
                <Star className="h-3.5 w-3.5 mr-1" />
                {t('review')}
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={() => onDelete(vendor)}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

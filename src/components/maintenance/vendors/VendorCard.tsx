
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, Image, FileText, Star, Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
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
    ? t('availableNow')
    : `${t('availableOn')} ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][Math.floor(Math.random() * 5)]}`;
  
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

  // Handler pour appeler ou copier le numéro
  const handleCallOrCopy = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = `tel:${vendor.phone}`;
    } else {
      navigator.clipboard.writeText(vendor.phone);
      // Une implémentation complète ajouterait un toast ici
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-primary">
      <CardHeader className="pb-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{vendor.name}</CardTitle>
          {isEmergencyView ? (
            <Phone className="h-5 w-5 text-red-500" />
          ) : (
            <Users className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex items-center mt-1">
          <Rating value={vendor.rating} onChange={() => {}} max={5} readonly={true} />
          <span className="ml-1 text-sm text-muted-foreground">
            {vendor.rating.toFixed(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-primary">{vendor.specialty}</span>
            </p>
            
            <Button
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10 -mr-2 p-1.5 h-auto"
              onClick={handleCallOrCopy}
            >
              <Phone className="h-3.5 w-3.5 mr-1" />
              {vendor.phone}
            </Button>
          </div>
          
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
              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Image className="h-4 w-4 text-primary" />
                {t('photos')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {vendor.photos.slice(0, 2).map((photo, index) => (
                  <AspectRatio key={index} ratio={16 / 9} className="overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={photo}
                      alt={`${vendor.name} - Photo ${index + 1}`}
                      className="object-cover w-full h-full transition-transform hover:scale-110 duration-200"
                    />
                  </AspectRatio>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                <FileText className="h-4 w-4 text-primary" />
                {t('documents')}
              </p>
              <div className="space-y-2">
                {documents.slice(0, 2).map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 group"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="truncate flex-1">{doc.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(vendor)}>
              {t('edit')}
            </Button>
            {onReview && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onReview}>
                <Star className="h-3.5 w-3.5 mr-1" />
                {t('reviews')}
              </Button>
            )}
            <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete(vendor)}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


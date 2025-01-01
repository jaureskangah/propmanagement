import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vendor } from "@/types/vendor";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface VendorCardProps {
  vendor: Vendor;
  isEmergencyView?: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, isEmergencyView, onEdit, onDelete }: VendorCardProps) => {
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
          <p><strong>Specialty:</strong> {vendor.specialty}</p>
          <p><strong>Phone:</strong> {vendor.phone}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Rating:</strong> {vendor.rating}/5</p>
          {vendor.emergency_contact && (
            <p className="text-red-500 font-semibold">Emergency contact</p>
          )}
          
          {vendor.photos && vendor.photos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Photos
              </p>
              <div className="grid grid-cols-2 gap-2">
                {vendor.photos.map((photo, index) => (
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
                Documents
              </p>
              <div className="space-y-2">
                {documents.map((doc) => (
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

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(vendor)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(vendor)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
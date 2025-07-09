import React, { useState } from "react";
import { Property } from "@/hooks/useProperties";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  Home,
  ImageIcon
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface PropertyDetailViewProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
  occupancyRate?: number;
  tenantsCount?: number;
}

const PropertyDetailView = ({
  property,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onViewFinancials,
  occupancyRate = 0,
  tenantsCount = 0
}: PropertyDetailViewProps) => {
  const { t } = useLocale();
  const [imageError, setImageError] = useState(false);

  if (!property) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-50";
    if (rate >= 50) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header avec image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
            {property.image_url && !imageError ? (
              <img
                src={property.image_url}
                alt={property.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            
            {/* Overlay avec titre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onViewFinancials(property.id)}
                className="bg-white/90 hover:bg-white"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Finances
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(property.id)}
                className="bg-white/90 hover:bg-white"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(property.id)}
                className="bg-red-500/90 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <div className="mt-1">
                          <Badge variant="secondary">{property.type}</Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nombre d'unités</label>
                        <div className="mt-1 text-lg font-semibold">{property.units}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Adresse complète</label>
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{property.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques d'occupation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Occupation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold">{tenantsCount}</div>
                        <div className="text-sm text-muted-foreground">Locataires actuels</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <div className={`text-2xl font-bold rounded-lg px-3 py-1 ${getOccupancyColor(occupancyRate)}`}>
                          {occupancyRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">Taux d'occupation</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar avec dates et actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Historique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                      <div className="mt-1">{formatDate(property.created_at)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Modifié le</label>
                      <div className="mt-1">{formatDate(property.updated_at)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => onViewFinancials(property.id)}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Voir les finances
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {/* TODO: Add tenant management */}}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Gérer les locataires
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {/* TODO: Add maintenance */}}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Maintenance
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailView;
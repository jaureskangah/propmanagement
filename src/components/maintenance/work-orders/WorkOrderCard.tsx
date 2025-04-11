
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  FileImage, 
  CheckSquare, 
  Building,
  Home,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ViewPhotosDialog } from "./components/ViewPhotosDialog";
import { EditWorkOrderDialog } from "./EditWorkOrderDialog";
import { useSupabaseDelete } from "@/hooks/supabase/useSupabaseDelete";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface WorkOrderCardProps {
  order: WorkOrder;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const WorkOrderCard = ({ order, onUpdate, onDelete }: WorkOrderCardProps) => {
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Utiliser le hook useSupabaseDelete pour supprimer un ordre de travail
  const { mutate: deleteWorkOrder, isPending: isDeleting } = useSupabaseDelete('vendor_interventions', {
    successMessage: "Ordre de travail supprimé avec succès",
    onSuccess: () => {
      if (onDelete) onDelete();
      setIsDeleteDialogOpen(false);
    }
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "En cours":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          className: "bg-blue-500"
        };
      case "Planifié":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-4 w-4 mr-1" />,
          className: "bg-orange-500"
        };
      case "Terminé":
        return {
          variant: "outline" as const,
          icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
          className: "bg-green-500 text-white"
        };
      default:
        return {
          variant: "default" as const,
          icon: <Wrench className="h-4 w-4 mr-1" />,
          className: ""
        };
    }
  };

  const handleDelete = () => {
    deleteWorkOrder(order.id);
  };

  const handleStatusUpdate = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    // Fermer le dialogue d'édition
    setIsEditDialogOpen(false);
    
    // Notifier le composant parent que des modifications ont été effectuées
    if (onUpdate) {
      onUpdate();
    }
    
    // Afficher un toast de confirmation
    toast({
      title: "Modifications enregistrées",
      description: "Les modifications ont été appliquées avec succès",
    });
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{order.title}</CardTitle>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Modifier</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 text-sm">
          {order.property && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <p className="truncate"><span className="font-medium">Propriété:</span> {order.property}</p>
            </div>
          )}
          {order.unit && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" />
              <p><span className="font-medium">Unité:</span> {order.unit}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-gray-500" />
            <p className="truncate"><span className="font-medium">Prestataire:</span> {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <p><span className="font-medium">Coût:</span> {order.cost}€</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusConfig.className}>
              <div className="flex items-center">
                {statusConfig.icon}
                {order.status}
              </div>
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => setIsPhotoDialogOpen(true)}
          disabled={!order.photos || order.photos.length === 0}
        >
          <FileImage className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Photos</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleStatusUpdate}
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Mettre à jour</span>
        </Button>
      </CardFooter>

      {/* Dialog pour visualiser les photos */}
      {order.photos && order.photos.length > 0 && (
        <ViewPhotosDialog 
          photos={order.photos}
          isOpen={isPhotoDialogOpen}
          onClose={() => setIsPhotoDialogOpen(false)}
        />
      )}

      {/* Dialog pour éditer l'ordre de travail */}
      {isEditDialogOpen && (
        <EditWorkOrderDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
          workOrder={order}
        />
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet ordre de travail ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

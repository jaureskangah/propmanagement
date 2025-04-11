
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { WorkOrder } from "@/types/workOrder";
import { ViewPhotosDialog } from "./components/ViewPhotosDialog";
import { EditWorkOrderDialog } from "./EditWorkOrderDialog";
import { WorkOrderDetails } from "./components/WorkOrderDetails";
import { WorkOrderActions } from "./components/WorkOrderActions";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { useWorkOrderCard } from "./hooks/useWorkOrderCard";

interface WorkOrderCardProps {
  order: WorkOrder;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const WorkOrderCard = ({ order, onUpdate, onDelete }: WorkOrderCardProps) => {
  const {
    isPhotoDialogOpen,
    setIsPhotoDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleting,
    handleDelete,
    confirmDelete,
    handleStatusUpdate,
    handleEditSuccess
  } = useWorkOrderCard({ order, onUpdate, onDelete });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{order.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <WorkOrderDetails order={order} />
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between">
        <WorkOrderActions 
          hasPhotos={Boolean(order.photos && order.photos.length > 0)}
          onViewPhotos={() => setIsPhotoDialogOpen(true)}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
        />
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
      <EditWorkOrderDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
        workOrder={order}
      />

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

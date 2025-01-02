import { AddTenantModal } from "@/components/tenant/AddTenantModal";
import { EditTenantModal } from "@/components/tenant/EditTenantModal";
import { DeleteTenantDialog } from "@/components/tenant/DeleteTenantDialog";
import type { Tenant } from "@/types/tenant";

interface TenantModalsProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedTenantData: Tenant | null;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onAddSubmit: (data: any) => Promise<void>;
  onEditSubmit: (data: any) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export const TenantModals = ({
  isAddModalOpen,
  isEditModalOpen,
  isDeleteDialogOpen,
  selectedTenantData,
  onAddClose,
  onEditClose,
  onDeleteClose,
  onAddSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: TenantModalsProps) => {
  return (
    <>
      <AddTenantModal 
        isOpen={isAddModalOpen}
        onClose={onAddClose}
        onSubmit={onAddSubmit}
      />

      {selectedTenantData && (
        <EditTenantModal
          isOpen={isEditModalOpen}
          onClose={onEditClose}
          tenant={selectedTenantData}
          onSubmit={onEditSubmit}
        />
      )}

      <DeleteTenantDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
};
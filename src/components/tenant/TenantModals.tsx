
import React from "react";
import { AddTenantModal } from "./AddTenantModal";
import { EditTenantModal } from "./EditTenantModal";
import { DeleteTenantDialog } from "./DeleteTenantDialog";
import { InviteTenantDialog } from "./communications/InviteTenantDialog";
import type { Tenant } from "@/types/tenant";

interface TenantModalsProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isInviteDialogOpen: boolean;
  selectedTenantData: Tenant | null;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onInviteClose: () => void;
  onAddSubmit: (data: any) => Promise<void>;
  onEditSubmit: (data: any) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const TenantModals = ({
  isAddModalOpen,
  isEditModalOpen,
  isDeleteDialogOpen,
  isInviteDialogOpen,
  selectedTenantData,
  onAddClose,
  onEditClose,
  onDeleteClose,
  onInviteClose,
  onAddSubmit,
  onEditSubmit,
  onDeleteConfirm,
  isDeleting = false,
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
          onSubmit={onEditSubmit}
          tenant={selectedTenantData}
        />
      )}

      <DeleteTenantDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        isDeleting={isDeleting}
      />

      {selectedTenantData && (
        <InviteTenantDialog
          isOpen={isInviteDialogOpen}
          onClose={onInviteClose}
          tenantId={selectedTenantData.id}
          defaultEmail={selectedTenantData.email}
        />
      )}
    </>
  );
};

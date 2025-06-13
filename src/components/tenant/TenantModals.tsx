
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
  isInviteDialogOpen?: boolean;
  selectedTenantData: Tenant | null;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onInviteClose?: () => void;
  onAddSubmit: (data: any) => void;
  onEditSubmit: (data: any) => void;
  onDeleteConfirm: () => void;
}

export const TenantModals = ({
  isAddModalOpen,
  isEditModalOpen,
  isDeleteDialogOpen,
  isInviteDialogOpen = false,
  selectedTenantData,
  onAddClose,
  onEditClose,
  onDeleteClose,
  onInviteClose = () => {},
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
        <>
          <EditTenantModal
            isOpen={isEditModalOpen}
            onClose={onEditClose}
            tenant={selectedTenantData}
            onSubmit={onEditSubmit}
          />

          <DeleteTenantDialog
            isOpen={isDeleteDialogOpen}
            onClose={onDeleteClose}
            tenant={selectedTenantData}
            onConfirm={onDeleteConfirm}
          />

          <InviteTenantDialog
            isOpen={isInviteDialogOpen}
            onClose={onInviteClose}
            tenantId={selectedTenantData.id}
            defaultEmail={selectedTenantData.email}
          />
        </>
      )}
    </>
  );
};

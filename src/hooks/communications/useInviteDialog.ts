
import { useState } from "react";

export const useInviteDialog = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  return {
    isInviteDialogOpen,
    openInviteDialog: () => setIsInviteDialogOpen(true),
    closeInviteDialog: () => setIsInviteDialogOpen(false),
  };
};

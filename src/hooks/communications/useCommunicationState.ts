import { useState } from "react";
import { Communication } from "@/types/tenant";

export const useCommunicationState = () => {
  const [isNewCommDialogOpen, setIsNewCommDialogOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [newCommData, setNewCommData] = useState({
    type: "email",
    subject: "",
    content: "",
    category: "general" // Keep this default value for backend logic
  });

  return {
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    setNewCommData
  };
};
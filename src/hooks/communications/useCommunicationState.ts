import { useState } from "react";
import { Communication } from "@/types/tenant";

export const useCommunicationState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [isNewCommDialogOpen, setIsNewCommDialogOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [newCommData, setNewCommData] = useState({
    type: "",
    subject: "",
    content: "",
    category: "general"
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    startDate,
    setStartDate,
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    setNewCommData
  };
};
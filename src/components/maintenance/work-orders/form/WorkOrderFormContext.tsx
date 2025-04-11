
import React, { createContext, useContext, useState } from "react";

interface WorkOrderFormContextType {
  // Form fields
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  propertyId: string | null;
  setPropertyId: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  cost: string;
  setCost: (value: string) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  status: string;
  setStatus: (value: string) => void;
  vendor: string;
  setVendor: (value: string) => void;
  photos: File[];
  setPhotos: (value: File[]) => void;
  
  // Form state
  currentStep: number;
  setCurrentStep: (value: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  
  // Form navigation
  navigateToStep: (step: number) => void;
  resetForm: () => void;
  
  // Initial property ID (passed from parent)
  initialPropertyId: string | null;
}

const WorkOrderFormContext = createContext<WorkOrderFormContextType | undefined>(undefined);

export const useWorkOrderForm = () => {
  const context = useContext(WorkOrderFormContext);
  if (!context) {
    throw new Error("useWorkOrderForm must be used within a WorkOrderFormProvider");
  }
  return context;
};

interface WorkOrderFormProviderProps {
  children: React.ReactNode;
  initialPropertyId: string | null;
}

export const WorkOrderFormProvider: React.FC<WorkOrderFormProviderProps> = ({ 
  children, 
  initialPropertyId 
}) => {
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyId, setPropertyId] = useState<string | null>(initialPropertyId);
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState("Scheduled");
  const [vendor, setVendor] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPropertyId(initialPropertyId);
    setUnit("");
    setCost("");
    setDate(undefined);
    setStatus("Scheduled");
    setVendor("");
    setPhotos([]);
    setCurrentStep(1);
    setIsSubmitting(false);
  };
  
  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= 3) { // 3 steps total
      setCurrentStep(step);
    }
  };
  
  const value = {
    title,
    setTitle,
    description,
    setDescription,
    propertyId,
    setPropertyId,
    unit,
    setUnit,
    cost,
    setCost,
    date,
    setDate,
    status,
    setStatus,
    vendor,
    setVendor,
    photos,
    setPhotos,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    navigateToStep,
    resetForm,
    initialPropertyId
  };
  
  return (
    <WorkOrderFormContext.Provider value={value}>
      {children}
    </WorkOrderFormContext.Provider>
  );
};

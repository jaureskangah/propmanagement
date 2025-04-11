
import React from "react";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Location } from "./Step2Location";
import { Step3WorkDetails } from "./Step3WorkDetails";
import { useWorkOrderForm } from "../WorkOrderFormContext";

export const StepContent = () => {
  const { currentStep } = useWorkOrderForm();

  switch (currentStep) {
    case 1:
      return <Step1BasicInfo />;
    case 2:
      return <Step2Location />;
    case 3:
      return <Step3WorkDetails />;
    default:
      return null;
  }
};

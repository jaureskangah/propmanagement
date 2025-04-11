
import React from "react";
import { useWorkOrderForm } from "./WorkOrderFormContext";

export const StepIndicator = () => {
  const { currentStep, navigateToStep } = useWorkOrderForm();
  const totalSteps = 3;

  return (
    <div className="flex items-center justify-between my-6 px-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <button
            type="button"
            onClick={() => navigateToStep(index + 1)}
            className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors ${
              currentStep >= index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}
          </button>
          {index < totalSteps - 1 && (
            <div 
              className={`h-1 w-full min-w-[3rem] mx-2 ${
                currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

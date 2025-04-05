
import React from "react";

export interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="text-red-500 text-xl mb-4">Error</div>
      <p className="text-gray-700">{error}</p>
    </div>
  );
};

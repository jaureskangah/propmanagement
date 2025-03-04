
import { FileText } from "lucide-react";

export const ErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
      <FileText className="h-12 w-12 text-red-500 mb-3 opacity-40" />
      <p className="text-red-500">Erreur de chargement des documents</p>
    </div>
  );
};

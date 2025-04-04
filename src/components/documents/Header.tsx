
import React from "react";
import { FileText } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="bg-white shadow-sm dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        </div>
      </div>
    </div>
  );
};

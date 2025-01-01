import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface WorkOrderHeaderProps {
  title: string;
}

export const WorkOrderHeader = ({ title }: WorkOrderHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Wrench className="h-5 w-5 text-blue-500" />
      </div>
    </CardHeader>
  );
};
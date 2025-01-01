import { Building, Home, Wrench, DollarSign } from "lucide-react";

interface WorkOrderDetailsProps {
  property: string;
  unit: string;
  vendor: string;
  cost: number;
}

export const WorkOrderDetails = ({ property, unit, vendor, cost }: WorkOrderDetailsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-gray-500" />
        <p><strong>Property:</strong> {property}</p>
      </div>
      <div className="flex items-center gap-2">
        <Home className="h-4 w-4 text-gray-500" />
        <p><strong>Unit:</strong> {unit}</p>
      </div>
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-gray-500" />
        <p><strong>Vendor:</strong> {vendor}</p>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <p><strong>Cost:</strong> ${cost}</p>
      </div>
    </div>
  );
};
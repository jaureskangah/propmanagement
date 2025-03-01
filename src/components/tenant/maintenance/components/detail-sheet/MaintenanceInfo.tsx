
import { MaintenanceRequest } from "@/types/tenant";
import { StatusAndPriority } from "./info/StatusAndPriority";
import { DescriptionSection } from "./info/DescriptionSection";
import { DeadlineInfo } from "./info/DeadlineInfo";
import { PhotoGallerySection } from "./info/PhotoGallerySection";

interface MaintenanceInfoProps {
  request: MaintenanceRequest;
}

export const MaintenanceInfo = ({ request }: MaintenanceInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Status and Priority */}
      <StatusAndPriority status={request.status} priority={request.priority} />

      {/* Description */}
      <DescriptionSection description={request.description} />

      {/* Deadline if available */}
      <DeadlineInfo deadline={request.deadline} />

      {/* Photos Gallery */}
      <PhotoGallerySection photos={request.photos} />
    </div>
  );
};

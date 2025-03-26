
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MaintenancePhotosTabProps {
  photos: string[];
}

export const MaintenancePhotosTab = ({ photos }: MaintenancePhotosTabProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div 
              className="cursor-pointer overflow-hidden rounded-md border hover:opacity-90 transition-opacity"
              onClick={() => setSelectedPhoto(photo)}
            >
              <AspectRatio ratio={1 / 1}>
                <img 
                  src={photo} 
                  alt={`Maintenance photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl p-1">
            <img 
              src={photo} 
              alt={`Maintenance photo ${index + 1}`}
              className="w-full object-contain max-h-[80vh]"
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
